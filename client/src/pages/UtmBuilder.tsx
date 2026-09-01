import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { UTMCampaignsTable } from "@/components/UTMCampaignsTable";
import { StatsCard } from "@/components/StatsCard";
import { CreateUTMCampaignDialog } from "@/components/CreateUTMCampaignDialog";
import { EditUTMCampaignDialog } from "@/components/EditUTMCampaignDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { UsageReportDialog } from "@/components/UsageReportDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, TrendingUp, Calendar, Globe, Plus, Search, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { UTMCampaign } from "@shared/schema";

export default function UtmBuilder() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<UTMCampaign | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: campaigns = [], isLoading } = useQuery<UTMCampaign[]>({
    queryKey: ["/api/utm-campaigns"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { 
      name: string; 
      shortCode: string;
      baseUrl: string; 
      source: string; 
      medium: string; 
      campaign: string; 
      term?: string; 
      content?: string;
    }) => {
      return apiRequest("POST", "/api/utm-campaigns", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/utm-campaigns"] });
      toast({
        title: "Campaign Created",
        description: "Your UTM campaign has been created successfully.",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to create UTM campaign. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: { 
        name?: string; 
        baseUrl?: string; 
        source?: string; 
        medium?: string; 
        campaign?: string; 
        term?: string; 
        content?: string;
      } 
    }) => {
      return apiRequest("PATCH", `/api/utm-campaigns/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/utm-campaigns"] });
      toast({
        title: "Campaign Updated",
        description: "Your UTM campaign has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update UTM campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/utm-campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/utm-campaigns"] });
      toast({
        title: "Campaign Deleted",
        description: "Your UTM campaign has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete UTM campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreate = (data: { 
    name: string; 
    shortCode: string;
    baseUrl: string; 
    source: string; 
    medium: string; 
    campaign: string; 
    term?: string; 
    content?: string;
  }) => {
    createMutation.mutate(data);
  };

  const handleEdit = (campaign: UTMCampaign) => {
    setSelectedCampaign(campaign);
    setEditDialogOpen(true);
  };

  const handleUpdate = (data: { 
    name: string; 
    baseUrl: string; 
    source: string; 
    medium: string; 
    campaign: string; 
    term?: string; 
    content?: string;
  }) => {
    if (selectedCampaign) {
      updateMutation.mutate({
        id: selectedCampaign.id,
        data,
      });
    }
  };

  const handleDelete = (campaign: UTMCampaign) => {
    setSelectedCampaign(campaign);
    setDeleteDialogOpen(true);
  };

  const handleViewReport = (campaign: UTMCampaign) => {
    setSelectedCampaign(campaign);
    setReportDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCampaign) {
      deleteMutation.mutate(selectedCampaign.id);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.medium.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.fullUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalVisits = campaigns.reduce((sum, campaign) => sum + campaign.visitCount, 0);
  const avgVisits = campaigns.length > 0 ? Math.round(totalVisits / campaigns.length) : 0;

  const thisMonth = new Date();
  thisMonth.setDate(1);
  const createdThisMonth = campaigns.filter(campaign => new Date(campaign.createdAt) >= thisMonth).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LinkIcon className="h-8 w-8" />
            UTM Builder
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage UTM campaign parameters
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/utm-builder/instructions">
            <Button variant="outline" data-testid="button-instructions">
              <BookOpen className="h-4 w-4 mr-2" />
              How It Works
            </Button>
          </Link>
          <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-campaign">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Campaigns"
          value={campaigns.length}
          icon={LinkIcon}
          testId="stat-total-campaigns"
        />
        <StatsCard
          title="Total Visits"
          value={totalVisits.toLocaleString()}
          icon={Globe}
          testId="stat-total-visits"
        />
        <StatsCard
          title="Avg. Visits/Campaign"
          value={avgVisits}
          icon={TrendingUp}
          testId="stat-avg-visits"
        />
        <StatsCard
          title="Created This Month"
          value={createdThisMonth}
          icon={Calendar}
          testId="stat-created-month"
        />
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, source, medium, campaign, or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>

        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center" data-testid="empty-state">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <LinkIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No UTM Campaigns Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Get started by creating your first UTM campaign. Track your marketing efforts with customizable URL parameters.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-first">
              Create Your First Campaign
            </Button>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No campaigns match your search.</p>
          </div>
        ) : (
          <UTMCampaignsTable
            campaigns={filteredCampaigns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewReport={handleViewReport}
          />
        )}
      </div>

      <CreateUTMCampaignDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
      />
      
      <EditUTMCampaignDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        campaign={selectedCampaign}
        onSubmit={handleUpdate}
      />
      
      <UsageReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        campaign={selectedCampaign}
      />
      
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        qrCodeName={selectedCampaign?.name || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
