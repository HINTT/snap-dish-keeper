import { Button } from "@/components/ui/button";
import { encodeRecipeToToken, buildShareUrl } from "@/lib/share";
import { toast } from "sonner";

type Props = {
  recipe: any; // replace with your Recipe type if you have one
  className?: string;
};

export default function ShareButton({ recipe, className }: Props) {
  const handleShare = async () => {
    try {
      const token = encodeRecipeToToken(recipe);
      const url = buildShareUrl(token);
      await navigator.clipboard?.writeText(url);
      toast.success("Share link copied to clipboard", { description: url });
    } catch (e) {
      toast.error("Could not create share link");
      console.error(e);
    }
  };

  return (
    <Button onClick={handleShare} className={className}>
      Share
    </Button>
  );
}
