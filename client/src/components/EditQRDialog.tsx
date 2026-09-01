import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { QRCode } from "@shared/schema";

const DOT_STYLES = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
];

const CORNER_STYLES = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
];

function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

function sanitizeHexColor(color: string, fallback: string): string {
  return isValidHexColor(color) ? color : fallback;
}

interface EditQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode: QRCode | null;
  onSubmit?: (data: { name: string; url: string; description: string; dotStyle: string; cornerStyle: string; foregroundColor: string; backgroundColor: string }) => void;
}

export function EditQRDialog({ open, onOpenChange, qrCode, onSubmit }: EditQRDialogProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [dotStyle, setDotStyle] = useState("square");
  const [cornerStyle, setCornerStyle] = useState("square");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const { data: imageData } = useQuery<{ image: string }>({
    queryKey: ["/api/qrcodes", qrCode?.id, "image"],
    queryFn: async () => {
      if (!qrCode) return { image: "" };
      const response = await fetch(`/api/qrcodes/${qrCode.id}/image`);
      return response.json();
    },
    enabled: !!qrCode && open,
  });

  useEffect(() => {
    if (qrCode) {
      setName(qrCode.name);
      setUrl(qrCode.redirectUrl);
      setDescription(qrCode.description || "");
      setDotStyle(qrCode.dotStyle || "square");
      setCornerStyle(qrCode.cornerStyle || "square");
      setForegroundColor(qrCode.foregroundColor || "#000000");
      setBackgroundColor(qrCode.backgroundColor || "#ffffff");
    }
  }, [qrCode]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validForeground = sanitizeHexColor(foregroundColor, "#000000");
    const validBackground = sanitizeHexColor(backgroundColor, "#ffffff");
    onSubmit?.({ name, url, description, dotStyle, cornerStyle, foregroundColor: validForeground, backgroundColor: validBackground });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="dialog-edit-qr">
        <DialogHeader>
          <DialogTitle>Edit QR Code</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details" data-testid="tab-details">Details</TabsTrigger>
                <TabsTrigger value="style" data-testid="tab-style">Style</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">QR Code Name</Label>
                  <Input
                    id="edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Product Landing Page"
                    required
                    data-testid="input-edit-name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-url">Redirect URL</Label>
                  <Input
                    id="edit-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    data-testid="input-edit-url"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description (Optional)</Label>
                  <Textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add notes about this QR code..."
                    rows={3}
                    data-testid="input-edit-description"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="style" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Dot Style</Label>
                  <Select value={dotStyle} onValueChange={setDotStyle}>
                    <SelectTrigger data-testid="select-dot-style">
                      <SelectValue placeholder="Select dot style" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOT_STYLES.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Corner Style</Label>
                  <Select value={cornerStyle} onValueChange={setCornerStyle}>
                    <SelectTrigger data-testid="select-corner-style">
                      <SelectValue placeholder="Select corner style" />
                    </SelectTrigger>
                    <SelectContent>
                      {CORNER_STYLES.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foreground-color">Foreground</Label>
                    <div className="flex gap-2">
                      <Input
                        id="foreground-color"
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="w-12 h-9 p-1 cursor-pointer"
                        data-testid="input-foreground-color"
                      />
                      <Input
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                        data-testid="input-foreground-hex"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="background-color">Background</Label>
                    <div className="flex gap-2">
                      <Input
                        id="background-color"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-9 p-1 cursor-pointer"
                        data-testid="input-background-color"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1"
                        placeholder="#ffffff"
                        data-testid="input-background-hex"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex items-center justify-center bg-muted rounded-lg p-6">
              <div className="text-center space-y-4">
                {imageData?.image ? (
                  <div className="w-48 h-48 rounded-lg flex items-center justify-center mx-auto p-2" style={{ backgroundColor }}>
                    <img src={imageData.image} alt="QR Code" className="w-full h-full" data-testid="img-qr-code" />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mx-auto p-4">
                    <div className="text-muted-foreground text-sm">Loading...</div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Save to update QR code preview
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
            <Button type="submit" data-testid="button-save">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
