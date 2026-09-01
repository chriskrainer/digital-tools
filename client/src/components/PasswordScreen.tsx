import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasswordScreenProps {
  onSuccess: () => void;
}

export function PasswordScreen({ onSuccess }: PasswordScreenProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  
  // Animated grid cells for rack simulation
  const [filledCells, setFilledCells] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // Calculate grid dimensions based on 80px cells
    const cols = Math.ceil(window.innerWidth / 80) + 1;
    const rows = Math.ceil(window.innerHeight / 80) + 1;
    const totalCells = cols * rows;
    
    // Start with some random cells filled
    const initialFilled = new Set<string>();
    for (let i = 0; i < Math.floor(totalCells * 0.15); i++) {
      const col = Math.floor(Math.random() * cols);
      const row = Math.floor(Math.random() * rows);
      initialFilled.add(`${col}-${row}`);
    }
    setFilledCells(initialFilled);
    
    // Randomly add/remove cells to simulate load movement
    const interval = setInterval(() => {
      setFilledCells(prev => {
        const next = new Set(prev);
        const col = Math.floor(Math.random() * cols);
        const row = Math.floor(Math.random() * rows);
        const key = `${col}-${row}`;
        
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        
        // Keep around 15% of cells filled
        if (next.size > totalCells * 0.2) {
          const entries = Array.from(next);
          next.delete(entries[Math.floor(Math.random() * entries.length)]);
        }
        
        return next;
      });
    }, 150);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(
          response.status === 429
            ? "Too many attempts. Please wait before trying again."
            : response.status === 503
              ? "Authentication is temporarily unavailable. Please try again."
              : "Incorrect password. Please try again.",
        );
        setPassword("");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to verify password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate grid for rendering
  const cols = Math.ceil(typeof window !== 'undefined' ? window.innerWidth / 80 : 20) + 1;
  const rows = Math.ceil(typeof window !== 'undefined' ? window.innerHeight / 80 : 15) + 1;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        backgroundImage: `
          linear-gradient(rgba(253,186,50,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(253,186,50,0.08) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        backgroundPosition: '0 0',
      }}
    >
      {/* Animated rack cells - simulating load movement */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: rows }).map((_, row) => (
          Array.from({ length: cols }).map((_, col) => {
            const key = `${col}-${row}`;
            const isFilled = filledCells.has(key);
            return (
              <div
                key={key}
                className="absolute transition-opacity duration-500"
                style={{
                  left: col * 80,
                  top: row * 80,
                  width: 79,
                  height: 79,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  opacity: isFilled ? 1 : 0,
                }}
              />
            );
          })
        ))}
      </div>
      {/* Subtle gray gradient from top-left corner */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top left, rgba(100,100,100,0.4) 0%, transparent 35%)'
        }}
      />
      {/* Subtle gray gradient from bottom-right corner */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom right, rgba(100,100,100,0.4) 0%, transparent 35%)'
        }}
      />
      
      {/* Main content */}
      <Card className="w-full max-w-md z-10 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Digital Tools</CardTitle>
          <CardDescription>
            Enter the access password to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoFocus
                data-testid="input-password"
              />
              {error && (
                <p className="text-sm text-destructive" data-testid="text-password-error">
                  {error}
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !password}
              data-testid="button-submit-password"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Access Site"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
