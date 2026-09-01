import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";

interface CreateUTMCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: { 
    name: string; 
    shortCode: string;
    baseUrl: string; 
    source: string; 
    medium: string; 
    campaign: string; 
    term?: string; 
    content?: string;
  }) => void;
}

export function CreateUTMCampaignDialog({ open, onOpenChange, onSubmit }: CreateUTMCampaignDialogProps) {
  const [name, setName] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePreviewUrl = () => {
    if (!baseUrl || !source || !medium || !campaign) return "";
    
    const params = new URLSearchParams();
    params.append('utm_source', source);
    params.append('utm_medium', medium);
    params.append('utm_campaign', campaign);
    if (term) params.append('utm_term', term);
    if (content) params.append('utm_content', content);
    
    return `${baseUrl}?${params.toString()}`;
  };

  const previewUrl = generatePreviewUrl();

  const handleCopy = () => {
    if (previewUrl) {
      navigator.clipboard.writeText(previewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ 
      name, 
      shortCode,
      baseUrl, 
      source, 
      medium, 
      campaign, 
      term: term || undefined, 
      content: content || undefined 
    });
    setName("");
    setShortCode("");
    setBaseUrl("");
    setSource("");
    setMedium("");
    setCampaign("");
    setTerm("");
    setContent("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-create-utm">
        <DialogHeader>
          <DialogTitle>Create New UTM Campaign</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Summer Sale 2024"
                  required
                  data-testid="input-campaign-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shortCode">
                  Short Code <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>
                </Label>
                <Input
                  id="shortCode"
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  placeholder="e.g., summer2024"
                  pattern="[a-z0-9_-]{3,20}"
                  minLength={3}
                  maxLength={20}
                  required
                  data-testid="input-short-code"
                />
                <p className="text-xs text-muted-foreground">
                  3-20 characters. Letters, numbers, hyphens, and underscores only. Cannot be changed later.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                  id="baseUrl"
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://example.com/landing"
                  required
                  data-testid="input-base-url"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">
                  Source <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>
                </Label>
                <Input
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g., google, newsletter, facebook"
                  required
                  data-testid="input-source"
                />
                <p className="text-xs text-muted-foreground">
                  Traffic source (where visitors came from)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medium">
                  Medium <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>
                </Label>
                <Input
                  id="medium"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="e.g., email, cpc, social"
                  required
                  data-testid="input-medium"
                />
                <p className="text-xs text-muted-foreground">
                  Marketing medium (how they arrived)
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign">
                  Campaign <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>
                </Label>
                <Input
                  id="campaign"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="e.g., summer_sale_2024"
                  required
                  data-testid="input-campaign"
                />
                <p className="text-xs text-muted-foreground">
                  Campaign identifier
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="term">
                  Term <Badge variant="outline" className="ml-2 text-xs">Optional</Badge>
                </Label>
                <Input
                  id="term"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="e.g., running shoes"
                  data-testid="input-term"
                />
                <p className="text-xs text-muted-foreground">
                  Paid search keywords
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">
                  Content <Badge variant="outline" className="ml-2 text-xs">Optional</Badge>
                </Label>
                <Input
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g., banner_ad, text_link"
                  data-testid="input-content"
                />
                <p className="text-xs text-muted-foreground">
                  Ad variation or content type
                </p>
              </div>
            </div>
          </div>

          {previewUrl && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Preview URL</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleCopy}
                  data-testid="button-copy-preview"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <code className="block text-xs font-mono bg-background p-3 rounded border break-all">
                {previewUrl}
              </code>
            </div>
          )}
          
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
              Create Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
