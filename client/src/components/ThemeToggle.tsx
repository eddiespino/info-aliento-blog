import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme !== "light";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="flex items-center space-x-1">
      <Sun className="h-[0.875rem] w-[0.875rem] text-muted-foreground" />
      <Switch 
        checked={isDark} 
        onCheckedChange={toggleTheme} 
        className="data-[state=checked]:bg-primary scale-75"
        aria-label="Toggle dark mode"
      />
      <Moon className="h-[0.875rem] w-[0.875rem] text-muted-foreground" />
    </div>
  );
}