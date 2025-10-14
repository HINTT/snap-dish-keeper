import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Copy, Check, Share2 } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  recipeName: string;
}

export const ShareDialog = ({ open, onOpenChange, recipeId, recipeName }: ShareDialogProps) => {
  const [shareLink, setShareLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      // First check if recipe already has a share token
      const { data: recipe } = await supabase
        .from('recipes')
        .select('share_token, is_public')
        .eq('id', recipeId)
        .single();

      let token = recipe?.share_token;

      if (!token) {
        // Generate new token using the database function
        const { data: tokenData, error: tokenError } = await supabase
          .rpc('generate_share_token');

        if (tokenError) throw tokenError;
        token = tokenData;

        // Update recipe with token and make it public
        const { error: updateError } = await supabase
          .from('recipes')
          .update({ 
            share_token: token, 
            is_public: true 
          })
          .eq('id', recipeId);

        if (updateError) throw updateError;
      } else if (!recipe.is_public) {
        // Recipe has token but isn't public, make it public
        const { error: updateError } = await supabase
          .from('recipes')
          .update({ is_public: true })
          .eq('id', recipeId);

        if (updateError) throw updateError;
      }

      const link = `${window.location.origin}/shared/${token}`;
      setShareLink(link);
      toast({ title: "Share link generated!", description: "You can now share this recipe" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast({ title: "Copied!", description: "Share link copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({ title: "Error", description: "Failed to copy link", variant: "destructive" });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setShareLink("");
      setCopied(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Recipe
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Share "<strong>{recipeName}</strong>" with your family and friends
          </p>

          {!shareLink ? (
            <Button onClick={generateShareLink} disabled={loading} className="w-full">
              {loading ? "Generating..." : "Generate Share Link"}
            </Button>
          ) : (
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly className="flex-1" />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
