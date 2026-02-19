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
import Dashboard from "@/pages/dashboard";
import Explorer from "@/pages/explorer";
import HierarchyTree from "@/pages/hierarchy-tree";
import Federations from "@/pages/federations";
import Associations from "@/pages/associations";
import Buildings from "@/pages/buildings";
import Staircases from "@/pages/staircases";
import Apartments from "@/pages/apartments";
import Expenses from "@/pages/expenses";
import Payments from "@/pages/payments";
import Announcements from "@/pages/announcements";
import UsersPage from "@/pages/users";
import ListaGenerala from "@/pages/lista-generala";
import PermissionsMatrix from "@/pages/permissions-matrix";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/explorer" component={Explorer} />
      <Route path="/hierarchy-tree" component={HierarchyTree} />
      <Route path="/federations" component={Federations} />
      <Route path="/associations" component={Associations} />
      <Route path="/buildings" component={Buildings} />
      <Route path="/staircases" component={Staircases} />
      <Route path="/apartments" component={Apartments} />
      <Route path="/expenses" component={Expenses} />
      <Route path="/payments" component={Payments} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/users" component={UsersPage} />
      <Route path="/permissions-matrix" component={PermissionsMatrix} />
      <Route path="/liste-generale/:listKey" component={ListaGenerala} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedApp() {
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
          <main className="flex-1 overflow-y-auto">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppContent() {
  return <AuthenticatedApp />;
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
