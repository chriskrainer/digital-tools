import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateClick?: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center" data-testid="empty-state">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <QrCode className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No QR Codes Yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Get started by creating your first dynamic QR code. Update redirect URLs anytime without regenerating the code.
      </p>
      <Button onClick={onCreateClick} data-testid="button-create-first">
        Create Your First QR Code
      </Button>
    </div>
  );
}
