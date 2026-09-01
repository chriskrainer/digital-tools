import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import type { UTMCampaign } from "@shared/schema";

interface EditUTMCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: UTMCampaign | null;
  onSubmit?: (data: { 
    name: string; 
    baseUrl: string; 
    source: string; 
    medium: string; 
    campaign: string; 
    term?: string; 
    content?: string;
  }) => void;
}

export function EditUTMCampaignDialog({ open, onOpenChange, campaign, onSubmit }: EditUTMCampaignDialogProps) {
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setBaseUrl(campaign.baseUrl);
      setSource(campaign.source);
      setMedium(campaign.medium);
      setCampaignName(campaign.campaign);
      setTerm(campaign.term || "");
      setContent(campaign.content || "");
    }
  }, [campaign]);

  const generatePreviewUrl = () => {
    if (!baseUrl || !source || !medium || !campaignName) return "";
    
    const params = new URLSearchParams();
    params.append('utm_source', source);
    params.append('utm_medium', medium);
    params.append('utm_campaign', campaignName);
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
      baseUrl, 
      source, 
      medium, 
      campaign: campaignName, 
      term: term || undefined, 
      content: content || undefined 
    });
    onOpenChange(false);
  };

  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-edit-utm">
        <DialogHeader>
          <DialogTitle>Edit UTM Campaign</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Campaign Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Summer Sale 2024"
                  required
                  data-testid="input-campaign-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-baseUrl">Base URL</Label>
                <Input
                  id="edit-baseUrl"
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://example.com/landing"
                  required
                  data-testid="input-base-url"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-source">
                  Source <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>
                </Label>
                <Input
                  id="edit-source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g., google, newsletter, facebook"
                  required
                  data-testid="input-source"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-medium">
                  Medium <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>
                </Label>
                <Input
                  id="edit-medium"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="e.g., email, cpc, social"
                  required
                  data-testid="input-medium"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-campaign">
                  Campaign <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>
                </Label>
                <Input
                  id="edit-campaign"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., summer_sale_2024"
                  required
                  data-testid="input-campaign"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-term">
                  Term <Badge variant="outline" className="ml-2 text-xs">Optional</Badge>
                </Label>
                <Input
                  id="edit-term"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="e.g., running shoes"
                  data-testid="input-term"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-content">
                  Content <Badge variant="outline" className="ml-2 text-xs">Optional</Badge>
                </Label>
                <Input
                  id="edit-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g., banner_ad, text_link"
                  data-testid="input-content"
                />
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
            <Button type="submit" data-testid="button-update">
              Update Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
