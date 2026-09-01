import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Download, Edit, Trash2, Copy, Check, BarChart3, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { QRCode } from "@shared/schema";

interface QRCodesTableProps {
  qrCodes: QRCode[];
  onEdit: (qr: QRCode) => void;
  onDelete: (qr: QRCode) => void;
  onDownload: (qr: QRCode) => void;
  onViewReport: (qr: QRCode) => void;
}

export function QRCodesTable({
  qrCodes,
  onEdit,
  onDelete,
  onDownload,
  onViewReport,
}: QRCodesTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewQR, setPreviewQR] = useState<QRCode | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
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
              <TableHead className="w-[80px] h-9 py-2">Number</TableHead>
              <TableHead className="h-9 py-2">Name</TableHead>
              <TableHead className="h-9 py-2">Description</TableHead>
              <TableHead className="h-9 py-2">Redirect URL</TableHead>
              <TableHead className="w-[100px] h-9 py-2 text-center">Scans</TableHead>
              <TableHead className="w-[120px] h-9 py-2">Created</TableHead>
              <TableHead className="w-[200px] h-9 py-2 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {qrCodes.map((qr) => (
              <TableRow key={qr.id} data-testid={`row-qrcode-${qr.id}`}>
                <TableCell className="py-2">
                  <Badge variant="secondary" className="font-mono text-xs" data-testid={`badge-qrnumber-${qr.id}`}>
                    #{qr.qrNumber}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium py-2" data-testid={`text-qrname-${qr.id}`}>
                  {qr.name}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate py-2" data-testid={`text-description-${qr.id}`}>
                  {qr.description || "-"}
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs text-muted-foreground truncate max-w-[300px]" data-testid={`text-url-${qr.id}`}>
                      {qr.redirectUrl}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => handleCopy(qr.id, qr.redirectUrl)}
                      data-testid={`button-copy-${qr.id}`}
                    >
                      {copiedId === qr.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center py-2" data-testid={`text-scans-${qr.id}`}>
                  {qr.scanCount}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs py-2" data-testid={`text-date-${qr.id}`}>
                  {formatDate(qr.createdAt)}
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center justify-end gap-0.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setPreviewQR(qr)}
                          data-testid={`button-view-${qr.id}`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View QR code</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onEdit(qr)}
                          data-testid={`button-edit-${qr.id}`}
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
                          onClick={() => onViewReport(qr)}
                          data-testid={`button-report-${qr.id}`}
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
                          onClick={() => onDownload(qr)}
                          data-testid={`button-download-${qr.id}`}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download QR Code</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onDelete(qr)}
                          data-testid={`button-delete-${qr.id}`}
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

      <QRCodePreviewDialog 
        qrCode={previewQR}
        open={!!previewQR}
        onOpenChange={(open) => !open && setPreviewQR(null)}
      />
    </>
  );
}

function QRCodePreviewDialog({ 
  qrCode, 
  open, 
  onOpenChange 
}: { 
  qrCode: QRCode | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { data: imageData } = useQuery<{ image: string }>({
    queryKey: ["/api/qrcodes", qrCode?.id, "image"],
    queryFn: async () => {
      if (!qrCode) return { image: "" };
      const response = await fetch(`/api/qrcodes/${qrCode.id}/image`);
      return response.json();
    },
    enabled: !!qrCode,
  });

  if (!qrCode) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code Preview</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="bg-white p-4 rounded-lg">
            {imageData?.image ? (
              <img
                src={imageData.image}
                alt={`QR Code for ${qrCode.name}`}
                className="w-64 h-auto"
                data-testid={`img-qrcode-preview-${qrCode.id}`}
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center bg-muted rounded">
                <p className="text-muted-foreground text-sm">Loading...</p>
              </div>
            )}
          </div>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="font-mono">
                #{qrCode.qrNumber}
              </Badge>
              <h3 className="font-semibold">{qrCode.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground font-mono">{qrCode.redirectUrl}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
