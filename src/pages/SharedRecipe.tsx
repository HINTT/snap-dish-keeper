import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { decodeRecipeFromToken } from "@/lib/share";
import { Button } from "@/components/ui/button";

type Recipe = {
  title?: string;
  ingredients?: string[];
  steps?: string[];
  // add other fields you support
};

export default function SharedRecipe() {
  const { token = "" } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = decodeRecipeFromToken(token);
    if (!data) setError("Invalid or corrupted share link.");
    else setRecipe(data as Recipe);
  }, [token]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4">
          <h1 className="text-xl font-semibold">Error</h1>
          <p className="text-red-500">{error}</p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{recipe.title ?? "Shared Recipe"}</h1>

      {recipe.ingredients?.length ? (
        <>
          <h2 className="text-lg font-semibold mt-2">Ingredients</h2>
          <ul className="list-disc ml-6 space-y-1">
            {recipe.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
          </ul>
        </>
      ) : null}

      {recipe.steps?.length ? (
        <>
          <h2 className="text-lg font-semibold mt-4">Steps</h2>
          <ol className="list-decimal ml-6 space-y-2">
            {recipe.steps.map((s, idx) => <li key={idx}>{s}</li>)}
          </ol>
        </>
      ) : null}
    </div>
  );
}
