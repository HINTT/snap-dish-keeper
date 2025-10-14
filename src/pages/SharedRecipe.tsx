import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChefHat, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Recipe {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
  image_url: string | null;
}

const SharedRecipe = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('share_token', token)
          .eq('is_public', true)
          .single();

        if (error) throw error;
        setRecipe(data);
      } catch (error: any) {
        toast({ 
          title: "Recipe not found", 
          description: "This recipe link may be invalid or no longer shared",
          variant: "destructive" 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <ChefHat className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Recipe Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This recipe link may be invalid or no longer available.
            </p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-warm p-2 rounded-lg">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Shared Recipe</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="overflow-hidden shadow-card">
          {recipe.image_url && (
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          )}
          
          <CardHeader>
            <CardTitle className="text-3xl">{recipe.name}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {recipe.ingredients && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {recipe.ingredients}
                  </pre>
                </div>
              </div>
            )}

            {recipe.instructions && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Instructions</h3>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {recipe.instructions}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Want to save your own recipes?
          </p>
          <Button onClick={() => navigate("/auth")}>
            Create Free Account
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SharedRecipe;
