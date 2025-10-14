import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Palette } from "lucide-react";

interface ThemeSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThemeSettings = ({ open, onOpenChange }: ThemeSettingsProps) => {
  const { colorScheme, themeMode, setColorScheme, setThemeMode } = useTheme();

  const colorSchemes = [
    { value: "orange", label: "Orange", color: "hsl(16 75% 55%)" },
    { value: "red", label: "Red", color: "hsl(0 72% 51%)" },
    { value: "green", label: "Green", color: "hsl(142 71% 45%)" },
    { value: "blue", label: "Blue", color: "hsl(221 83% 53%)" },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Theme Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              Theme Mode
            </Label>
            <div className="flex gap-2">
              <Button
                variant={themeMode === "light" ? "default" : "outline"}
                onClick={() => setThemeMode("light")}
                className="flex-1"
              >
                <Sun className="w-4 h-4 mr-2" />
                Light
              </Button>
              <Button
                variant={themeMode === "dark" ? "default" : "outline"}
                onClick={() => setThemeMode("dark")}
                className="flex-1"
              >
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color Scheme
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {colorSchemes.map((scheme) => (
                <Button
                  key={scheme.value}
                  variant={colorScheme === scheme.value ? "default" : "outline"}
                  onClick={() => setColorScheme(scheme.value)}
                  className="justify-start"
                >
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: scheme.color }}
                  />
                  {scheme.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
