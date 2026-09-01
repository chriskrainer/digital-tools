import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { QRCode } from "@shared/schema";

interface ScanReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode: QRCode | null;
}

export function ScanReportDialog({ open, onOpenChange, qrCode }: ScanReportDialogProps) {
  const { data: analytics = [], isLoading } = useQuery<{ date: string; count: number }[]>({
    queryKey: ["/api/qrcodes", qrCode?.id, "analytics"],
    queryFn: async () => {
      if (!qrCode) return [];
      const response = await fetch(`/api/qrcodes/${qrCode.id}/analytics?days=30`);
      return response.json();
    },
    enabled: !!qrCode && open,
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = analytics.map(item => ({
    ...item,
    formattedDate: formatDate(item.date),
  }));

  const totalScans = analytics.reduce((sum, item) => sum + item.count, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl" data-testid="dialog-scan-report">
        <DialogHeader>
          <DialogTitle>Scan Analytics - {qrCode?.name}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Scans (30 days)</p>
                <p className="text-3xl font-bold" data-testid="text-total-scans">{totalScans}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Average per Day</p>
                <p className="text-3xl font-bold" data-testid="text-avg-scans">
                  {analytics.length > 0 ? (totalScans / 30).toFixed(1) : 0}
                </p>
              </div>
            </div>

            {chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="formattedDate" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                      name="Scans"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No scan data available yet</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
