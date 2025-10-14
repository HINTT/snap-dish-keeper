import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";

interface Recipe {
  id?: string;
  name: string;
  ingredients: string;
  instructions: string;
  image_url?: string | null;
}

interface RecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe | null;
  onSave: () => void;
}

export const RecipeDialog = ({ open, onOpenChange, recipe, onSave }: RecipeDialogProps) => {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setIngredients(recipe.ingredients || "");
      setInstructions(recipe.instructions || "");
      setImagePreview(recipe.image_url || null);
    } else {
      setName("");
      setIngredients("");
      setInstructions("");
      setImagePreview(null);
      setImageFile(null);
    }
  }, [recipe, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: "Error", description: "Please enter a recipe name", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let imageUrl = recipe?.image_url || null;

      // Upload image if a new one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('recipe-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('recipe-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const recipeData = {
        name,
        ingredients,
        instructions,
        image_url: imageUrl,
        user_id: user.id,
      };

      if (recipe?.id) {
        const { error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', recipe.id);
        if (error) throw error;
        toast({ title: "Success", description: "Recipe updated successfully" });
      } else {
        const { error } = await supabase
          .from('recipes')
          .insert([recipeData]);
        if (error) throw error;
        toast({ title: "Success", description: "Recipe created successfully" });
      }

      onSave();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!recipe?.id) return;

    if (!confirm("Are you sure you want to delete this recipe?")) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipe.id);

      if (error) throw error;

      toast({ title: "Success", description: "Recipe deleted successfully" });
      onSave();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe ? "Edit Recipe" : "Add New Recipe"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Recipe Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Spaghetti Carbonara"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Recipe Photo</Label>
            <div className="flex flex-col gap-2">
              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <label htmlFor="image" className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>Click to upload photo</span>
                </div>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients</Label>
            <Textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="List your ingredients here..."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Write the cooking instructions..."
              rows={8}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          {recipe?.id && (
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Recipe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
