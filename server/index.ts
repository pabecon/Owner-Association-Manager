import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    if (process.env.REPL_ID) {
      const { setupAuth, registerAuthRoutes } = await import("./replit_integrations/auth");
      await setupAuth(app);
      registerAuthRoutes(app);
    } else {
      const session = (await import("express-session")).default;
      if (process.env.DATABASE_URL) {
        const connectPg = (await import("connect-pg-simple")).default;
        const pgStore = connectPg(session);
        const store = new pgStore({
          conString: process.env.DATABASE_URL,
          createTableIfMissing: true,
          tableName: "sessions",
        });
        app.set("trust proxy", 1);
        app.use(session({
          store,
          secret: process.env.SESSION_SECRET || "adminbloc-session-secret",
          resave: false,
          saveUninitialized: false,
          cookie: { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 },
        }));
        console.log("[auth] Using PostgreSQL session store.");
      } else {
        app.use(session({
          secret: process.env.SESSION_SECRET || "adminbloc-session-secret",
          resave: false,
          saveUninitialized: false,
          cookie: { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 },
        }));
        console.log("[auth] Warning: Using MemoryStore (no DATABASE_URL).");
      }
      console.log("[auth] Replit Auth not available (REPL_ID missing). Running with session-only auth.");
    }
  } catch (err) {
    console.error("[auth] Failed to initialize auth:", err);
    process.exit(1);
  }

  try {
    const { seedDatabase } = await import("./seed");
    await seedDatabase();
  } catch (err) {
    console.error("[seed] Failed to seed database:", err);
  }

  try {
    await registerRoutes(httpServer, app);
  } catch (err) {
    console.error("[routes] Failed to register routes:", err);
    process.exit(1);
  }

  try {
    const { startDailySync } = await import("./bnr-sync");
    startDailySync();
  } catch (err) {
    console.error("[bnr-sync] Failed to start daily sync:", err);
  }

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
