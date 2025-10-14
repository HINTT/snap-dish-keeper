import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeDialog } from "@/components/recipes/RecipeDialog";
import { Plus, LogOut, ChefHat } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Recipe {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
  image_url: string | null;
}

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }
      fetchRecipes();
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleAddRecipe = () => {
    setSelectedRecipe(null);
    setDialogOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setDialogOpen(true);
  };

  const handleSave = () => {
    fetchRecipes();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading your recipes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-warm p-2 rounded-lg">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">My Recipes</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <p className="text-muted-foreground">
            {recipes.length === 0 ? "No recipes yet" : `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`}
          </p>
          <Button onClick={handleAddRecipe} className="shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Add Recipe
          </Button>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <ChefHat className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No recipes yet</h2>
            <p className="text-muted-foreground mb-6">Start building your collection by adding your first recipe</p>
            <Button onClick={handleAddRecipe}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Recipe
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                name={recipe.name}
                imageUrl={recipe.image_url}
                onClick={() => handleEditRecipe(recipe)}
              />
            ))}
          </div>
        )}
      </main>

      <RecipeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        recipe={selectedRecipe}
        onSave={handleSave}
      />
    </div>
  );
};

export default Recipes;
