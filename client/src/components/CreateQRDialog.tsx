import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: { name: string; url: string; description: string }) => void;
}

export function CreateQRDialog({ open, onOpenChange, onSubmit }: CreateQRDialogProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create QR Code:", { name, url, description });
    onSubmit?.({ name, url, description });
    setName("");
    setUrl("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="dialog-create-qr">
        <DialogHeader>
          <DialogTitle>Create New QR Code</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">QR Code Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Product Landing Page"
                  required
                  data-testid="input-qr-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">Redirect URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                  data-testid="input-qr-url"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add notes about this QR code..."
                  rows={4}
                  data-testid="input-qr-description"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-center bg-muted rounded-lg p-6">
              <div className="text-center space-y-4">
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mx-auto">
                  <p className="text-sm text-muted-foreground">QR Preview</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Preview will appear after creation
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button type="submit" data-testid="button-create">
              Create QR Code
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
