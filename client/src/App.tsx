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
import UserStats from "@/pages/user-stats";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import { KeychainProvider } from "./context/KeychainContext";
import { LanguageProvider } from "./context/LanguageContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/witnesses" component={Witnesses} />
      <Route path="/about" component={About} />
      <Route path="/witness/:name" component={WitnessProfile} />
      <Route path="/user-stats" component={UserStats} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <KeychainProvider>
        <LanguageProvider>
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
        </LanguageProvider>
      </KeychainProvider>
    </QueryClientProvider>
  );
}

export default App;
