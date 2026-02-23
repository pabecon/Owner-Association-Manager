import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { UsersSidebar } from "@/components/users-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import NotFound from "@/pages/not-found";
import HierarchyTree from "@/pages/hierarchy-tree";
import AssociationPortal from "@/pages/association-portal";
import ListaGenerala from "@/pages/lista-generala";
import Legislatie from "@/pages/legislatie";
import UnitDetail from "@/pages/unit-detail";
import UsersPage from "@/pages/users";
import ContractsPage from "@/pages/contracts";
import PermissionsMatrix from "@/pages/permissions-matrix";
import ListaUtilizatoriPage from "@/pages/lista-utilizatori";
import UtilizatorDetail from "@/pages/utilizator-detail";
import Gdpr from "@/pages/gdpr";
import ContractTemplatesPage from "@/pages/contract-templates";
import VenituriPage from "@/pages/venituri";
import { CookieConsent } from "@/components/cookie-consent";

function SuperAdminRouter() {
  return (
    <Switch>
      <Route path="/" component={HierarchyTree} />
      <Route path="/liste-generale/:listKey" component={ListaGenerala} />
      <Route path="/legislatie/:lawId" component={Legislatie} />
      <Route path="/legislatie" component={Legislatie} />
      <Route path="/utilizatori" component={UsersPage} />
      <Route path="/matrice-permisiuni" component={PermissionsMatrix} />
      <Route path="/contracte" component={ContractsPage} />
      <Route path="/sabloane-contracte" component={ContractTemplatesPage} />
      <Route path="/venituri" component={VenituriPage} />
      <Route path="/gdpr/:docId" component={Gdpr} />
      <Route path="/gdpr" component={Gdpr} />
      <Route component={NotFound} />
    </Switch>
  );
}

function SuperAdminLayout() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-2 p-2 border-b sticky top-0 z-50 bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 overflow-hidden">
            <SuperAdminRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function UnitLayout() {
  return (
    <div className="flex flex-col h-screen w-full">
      <header className="flex items-center justify-between gap-2 p-2 border-b sticky top-0 z-50 bg-background">
        <div />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <UnitDetail />
      </main>
    </div>
  );
}

function UsersRouter() {
  return (
    <Switch>
      <Route path="/lista-utilizatori" component={ListaUtilizatoriPage} />
      <Route path="/utilizator/:id" component={UtilizatorDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function UsersLayout() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <UsersSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-2 p-2 border-b sticky top-0 z-50 bg-background">
            <SidebarTrigger data-testid="button-users-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 overflow-hidden">
            <UsersRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/asociatie/:id" component={AssociationPortal} />
      <Route path="/unitate/:id" component={UnitLayout} />
      <Route path="/lista-utilizatori" component={UsersLayout} />
      <Route path="/utilizator/:id" component={UsersLayout} />
      <Route>
        <SuperAdminLayout />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppRouter />
          <Toaster />
          <CookieConsent />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
