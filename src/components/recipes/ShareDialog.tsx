import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Copy, Check, Share2 } from "lucide-react";
import { encodeRecipeToToken, buildShareUrl } from "@/lib/share";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** pass the whole recipe so we can encode it */
  recipe: any;
}

export const ShareDialog = ({ open, onOpenChange, recipe }: ShareDialogProps) => {
  const [shareLink, setShareLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const token = encodeRecipeToToken(recipe);
      const link = buildShareUrl(token);
      setShareLink(link);
      toast({ title: "Share link generated!", description: "Copied to clipboard." });
      await navigator.clipboard?.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Failed to generate link", variant: "destructive" });
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
    } catch {
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
            Share "<strong>{recipe?.title ?? recipe?.name ?? "Recipe"}</strong>" with your family and friends
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
                <Button size="icon" variant="outline" onClick={copyToClipboard}>
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
