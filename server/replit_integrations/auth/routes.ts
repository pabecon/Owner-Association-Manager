import type { Express } from "express";
import { authStorage } from "./storage";

export function registerAuthRoutes(app: Express): void {
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      const defaultUser = {
        id: "default-admin",
        email: "admin@adminbloc.ro",
        firstName: "Super",
        lastName: "Admin",
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await authStorage.upsertUser(defaultUser);
      const user = await authStorage.getUser("default-admin");
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
