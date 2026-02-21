import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
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

function SuperAdminRouter() {
  return (
    <Switch>
      <Route path="/" component={HierarchyTree} />
      <Route path="/liste-generale/:listKey" component={ListaGenerala} />
      <Route path="/legislatie/:lawId" component={Legislatie} />
      <Route path="/legislatie" component={Legislatie} />
      <Route path="/unitate/:id" component={UnitDetail} />
      <Route path="/utilizatori" component={UsersPage} />
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

function AppRouter() {
  return (
    <Switch>
      <Route path="/asociatie/:id" component={AssociationPortal} />
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
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
