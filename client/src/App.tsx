import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Witnesses from "@/pages/witnesses";
import About from "@/pages/about";
import WitnessProfile from "@/pages/witness-profile";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import { KeychainProvider } from "./context/KeychainContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/witnesses" component={Witnesses} />
      <Route path="/about" component={About} />
      <Route path="/@:name" component={WitnessProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <KeychainProvider>
        <ThemeProvider defaultTheme="system">
          <TooltipProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </KeychainProvider>
    </QueryClientProvider>
  );
}

export default App;
