
//import { Toaster } from "@/components/ui/toaster";
//import { Toaster as Sonner } from "@/components/ui/sonner";
//import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import KanbanBoard from "./pages/KanbanBoard";
import OkrKpi from "./pages/OkrKpi";
import WeeklyNotes from "./pages/WeeklyNotes";
//import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/*<TooltipProvider>
      <Toaster />
      <Sonner />*/}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/kanban"
            element={
              <Layout>
                <KanbanBoard />
              </Layout>
            }
          />
          <Route
            path="/okr-kpi"
            element={
              <Layout>
                <OkrKpi />
              </Layout>
            }
          />
          <Route
            path="/weekly-notes"
            element={
              <Layout>
                <WeeklyNotes />
              </Layout>
            }
          />
          {/*<Route path="*" element={<NotFound />} />*/}
        </Routes>
      </BrowserRouter>
    {/*</TooltipProvider>*/}
  </QueryClientProvider>
);

export default App;
