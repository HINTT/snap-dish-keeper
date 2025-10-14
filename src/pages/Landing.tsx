import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import heroImage from "@/assets/hero-recipe.jpg";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/recipes");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Beautiful kitchen with fresh ingredients and cookbook"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>
        
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-warm p-3 rounded-xl shadow-card">
                <ChefHat className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                My Recipe Collection
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-foreground mb-4">
              Save and organize all your favorite recipes in one beautiful place
            </p>
            
            <p className="text-lg text-muted-foreground mb-8">
              Capture recipes you see online, add your own photos, and keep track of ingredients and instructions. Your personal cookbook, always at your fingertips.
            </p>
            
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-card-hover"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
