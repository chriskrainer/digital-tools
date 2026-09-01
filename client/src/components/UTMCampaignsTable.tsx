import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Trash2, Copy, Check, BarChart3, Eye, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { UTMCampaign } from "@shared/schema";

interface UTMCampaignsTableProps {
  campaigns: UTMCampaign[];
  onEdit: (campaign: UTMCampaign) => void;
  onDelete: (campaign: UTMCampaign) => void;
  onViewReport: (campaign: UTMCampaign) => void;
}

export function UTMCampaignsTable({
  campaigns,
  onEdit,
  onDelete,
  onViewReport,
}: UTMCampaignsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewCampaign, setPreviewCampaign] = useState<UTMCampaign | null>(null);

  const handleCopy = (shortCode: string, id: string) => {
    const trackingLink = `${window.location.origin}/c/${shortCode}`;
    navigator.clipboard.writeText(trackingLink);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-9 py-2">Name</TableHead>
              <TableHead className="h-9 py-2">Source</TableHead>
              <TableHead className="h-9 py-2">Medium</TableHead>
              <TableHead className="h-9 py-2">Campaign</TableHead>
              <TableHead className="w-[100px] h-9 py-2 text-center">Visits</TableHead>
              <TableHead className="w-[120px] h-9 py-2">Created</TableHead>
              <TableHead className="w-[200px] h-9 py-2 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id} data-testid={`row-campaign-${campaign.id}`}>
                <TableCell className="font-medium py-2" data-testid={`text-campaign-name-${campaign.id}`}>
                  {campaign.name}
                </TableCell>
                <TableCell className="py-2">
                  <Badge variant="secondary" className="text-xs" data-testid={`badge-source-${campaign.id}`}>
                    {campaign.source}
                  </Badge>
                </TableCell>
                <TableCell className="py-2">
                  <Badge variant="secondary" className="text-xs" data-testid={`badge-medium-${campaign.id}`}>
                    {campaign.medium}
                  </Badge>
                </TableCell>
                <TableCell className="py-2">
                  <Badge variant="secondary" className="text-xs" data-testid={`badge-campaign-${campaign.id}`}>
                    {campaign.campaign}
                  </Badge>
                </TableCell>
                <TableCell className="text-center py-2" data-testid={`text-visits-${campaign.id}`}>
                  {campaign.visitCount}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs py-2" data-testid={`text-date-${campaign.id}`}>
                  {formatDate(campaign.createdAt)}
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center justify-end gap-0.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setPreviewCampaign(campaign)}
                          data-testid={`button-view-${campaign.id}`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View details</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleCopy(campaign.shortCode, campaign.id)}
                          data-testid={`button-copy-${campaign.id}`}
                        >
                          {copiedId === campaign.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy tracking link</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onEdit(campaign)}
                          data-testid={`button-edit-${campaign.id}`}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit details</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onViewReport(campaign)}
                          data-testid={`button-report-${campaign.id}`}
                        >
                          <BarChart3 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View analytics</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onDelete(campaign)}
                          data-testid={`button-delete-${campaign.id}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CampaignPreviewDialog 
        campaign={previewCampaign}
        open={!!previewCampaign}
        onOpenChange={(open) => !open && setPreviewCampaign(null)}
      />
    </>
  );
}

function CampaignPreviewDialog({ 
  campaign, 
  open, 
  onOpenChange 
}: { 
  campaign: UTMCampaign | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [copiedTrackingLink, setCopiedTrackingLink] = useState(false);
  const [copiedFullUrl, setCopiedFullUrl] = useState(false);

  const handleCopyTrackingLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedTrackingLink(true);
    setTimeout(() => setCopiedTrackingLink(false), 2000);
  };

  const handleCopyFullUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedFullUrl(true);
    setTimeout(() => setCopiedFullUrl(false), 2000);
  };

  if (!campaign) return null;

  const trackingLink = `${window.location.origin}/c/${campaign.shortCode}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>UTM Campaign Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-semibold mb-2">{campaign.name}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Source</p>
                <Badge variant="secondary">{campaign.source}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Medium</p>
                <Badge variant="secondary">{campaign.medium}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Campaign</p>
                <Badge variant="secondary">{campaign.campaign}</Badge>
              </div>
              {campaign.term && (
                <div>
                  <p className="text-muted-foreground">Term</p>
                  <Badge variant="secondary">{campaign.term}</Badge>
                </div>
              )}
              {campaign.content && (
                <div>
                  <p className="text-muted-foreground">Content</p>
                  <Badge variant="secondary">{campaign.content}</Badge>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 border-2 border-primary/20 rounded-lg p-3 bg-primary/5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Tracking Link</p>
              <Badge variant="default" className="text-xs">Share This</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this link to track visits and redirect to your destination URL with UTM parameters
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background p-2 rounded font-mono break-all border">
                {trackingLink}
              </code>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyTrackingLink(trackingLink)}
                    data-testid="button-copy-tracking-link"
                  >
                    {copiedTrackingLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy tracking link to clipboard</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(trackingLink, '_blank')}
                    data-testid="button-open-tracking-link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open tracking link in new tab</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Base URL</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-muted p-2 rounded font-mono break-all">
                {campaign.baseUrl}
              </code>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Full UTM URL</p>
            <p className="text-xs text-muted-foreground">
              Final destination URL with UTM parameters (visits not tracked if shared directly)
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-muted p-2 rounded font-mono break-all">
                {campaign.fullUrl}
              </code>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyFullUrl(campaign.fullUrl)}
                    data-testid="button-copy-full-url"
                  >
                    {copiedFullUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy URL to clipboard</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(campaign.fullUrl, '_blank')}
                    data-testid="button-open-url"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open URL in new tab</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
