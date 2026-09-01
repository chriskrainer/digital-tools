import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QRCodesTable } from "@/components/QRCodesTable";
import { StatsCard } from "@/components/StatsCard";
import { CreateQRDialog } from "@/components/CreateQRDialog";
import { EditQRDialog } from "@/components/EditQRDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { ScanReportDialog } from "@/components/ScanReportDialog";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, ScanLine, TrendingUp, Calendar, Plus, Search, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { QRCode, UpdateQRCode } from "@shared/schema";

export default function Dashboard() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: qrCodes = [], isLoading } = useQuery<QRCode[]>({
    queryKey: ["/api/qrcodes"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; redirectUrl: string; description?: string }) => {
      return apiRequest("POST", "/api/qrcodes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/qrcodes"] });
      toast({
        title: "QR Code Created",
        description: "Your QR code has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create QR code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateQRCode }) => {
      return apiRequest("PATCH", `/api/qrcodes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/qrcodes"] });
      toast({
        title: "QR Code Updated",
        description: "Your QR code has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update QR code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/qrcodes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/qrcodes"] });
      toast({
        title: "QR Code Deleted",
        description: "Your QR code has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete QR code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreate = (data: { name: string; url: string; description: string }) => {
    createMutation.mutate({
      name: data.name,
      redirectUrl: data.url,
      description: data.description || undefined,
    });
  };

  const handleEdit = (qr: QRCode) => {
    setSelectedQR(qr);
    setEditDialogOpen(true);
  };

  const handleUpdate = (data: { name: string; url: string; description: string; dotStyle: string; cornerStyle: string; foregroundColor: string; backgroundColor: string }) => {
    if (selectedQR) {
      updateMutation.mutate({
        id: selectedQR.id,
        data: {
          name: data.name,
          redirectUrl: data.url,
          description: data.description || undefined,
          dotStyle: data.dotStyle,
          cornerStyle: data.cornerStyle,
          foregroundColor: data.foregroundColor,
          backgroundColor: data.backgroundColor,
        },
      });
    }
  };

  const handleDelete = (qr: QRCode) => {
    setSelectedQR(qr);
    setDeleteDialogOpen(true);
  };

  const handleViewReport = (qr: QRCode) => {
    setSelectedQR(qr);
    setReportDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedQR) {
      deleteMutation.mutate(selectedQR.id);
    }
  };

  const handleDownload = async (qr: QRCode) => {
    try {
      const response = await fetch(`/api/qrcodes/${qr.id}/image`);
      const data = await response.json();
      
      const link = document.createElement("a");
      link.href = data.image;
      link.download = `${qr.name.replace(/\s+/g, "-")}.png`;
      link.click();
      
      toast({
        title: "Download Started",
        description: "Your QR code is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredQRCodes = qrCodes.filter(qr =>
    qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qr.redirectUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qr.qrNumber.toString().includes(searchQuery)
  );

  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0);
  const avgScans = qrCodes.length > 0 ? Math.round(totalScans / qrCodes.length) : 0;

  const thisMonth = new Date();
  thisMonth.setDate(1);
  const createdThisMonth = qrCodes.filter(qr => new Date(qr.createdAt) >= thisMonth).length;

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
            <QrCode className="h-8 w-8" />
            QR Code Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your dynamic QR codes
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dqm/instructions">
            <Button variant="outline" data-testid="button-instructions">
              <BookOpen className="h-4 w-4 mr-2" />
              How It Works
            </Button>
          </Link>
          <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-qr">
            <Plus className="h-4 w-4 mr-2" />
            Create QR Code
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total QR Codes"
          value={qrCodes.length}
          icon={QrCode}
          testId="stat-total-qr"
        />
        <StatsCard
          title="Total Scans"
          value={totalScans.toLocaleString()}
          icon={ScanLine}
          testId="stat-total-scans"
        />
        <StatsCard
          title="Avg. Scans/Code"
          value={avgScans}
          icon={TrendingUp}
          testId="stat-avg-scans"
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
            placeholder="Search by number, name, or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>

        {qrCodes.length === 0 ? (
          <EmptyState onCreateClick={() => setCreateDialogOpen(true)} />
        ) : filteredQRCodes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No QR codes match your search.</p>
          </div>
        ) : (
          <QRCodesTable
            qrCodes={filteredQRCodes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onViewReport={handleViewReport}
          />
        )}
      </div>

      <CreateQRDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
      />
      
      <EditQRDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        qrCode={selectedQR}
        onSubmit={handleUpdate}
      />
      
      <ScanReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        qrCode={selectedQR}
      />
      
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        qrCodeName={selectedQR?.name || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
