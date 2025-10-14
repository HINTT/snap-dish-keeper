import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface RecipeCardProps {
  id: string;
  name: string;
  imageUrl: string | null;
  onClick: () => void;
}

export const RecipeCard = ({ name, imageUrl, onClick }: RecipeCardProps) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-card-hover shadow-card group"
      onClick={onClick}
    >
      <AspectRatio ratio={4 / 3} className="bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-warm flex items-center justify-center">
            <span className="text-primary-foreground text-4xl font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </AspectRatio>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{name}</h3>
      </CardContent>
    </Card>
  );
};
