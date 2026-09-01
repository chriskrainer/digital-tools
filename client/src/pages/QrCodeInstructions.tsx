import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, QrCode, BarChart3, Download, Smartphone } from "lucide-react";
import { Link } from "wouter";
import workflowDiagram from "@assets/generated_images/QR_workflow_with_correct_numbering_55feecb7.png";

export default function QrCodeInstructions() {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <Link href="/dqm">
          <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back-to-manager">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to QR Code Manager
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">How QR Code Manager Works</h1>
        <p className="text-muted-foreground">
          Learn how to create dynamic QR codes and track their usage
        </p>
      </div>

      {/* Visual Diagram */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>QR Code Manager Workflow</CardTitle>
          <CardDescription>
            From QR code creation to analytics tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <img 
            src={workflowDiagram} 
            alt="QR Code Manager workflow diagram showing the complete process from QR code creation to analytics tracking" 
            className="w-full rounded-lg border"
            data-testid="img-workflow-diagram"
          />
        </CardContent>
      </Card>

      {/* What is QR Code Manager */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            What is QR Code Manager?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            QR Code Manager helps you create dynamic QR codes with customizable redirect URLs. 
            Unlike static QR codes, you can update where your QR codes point without having to 
            reprint them, making them perfect for marketing materials, product packaging, and event signage.
          </p>
          <div className="bg-muted p-4 rounded-md">
            <p className="font-semibold mb-2">Key Benefit:</p>
            <p className="text-sm">
              Print your QR code once, update the destination URL anytime. If you need to change 
              where your QR code leads, simply update it in the system - no need to reprint or redistribute.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sequential Numbering System */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sequential Numbering System</CardTitle>
          <CardDescription>
            Easy identification and organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Each QR code is automatically assigned a unique sequential number (starting from #1, #2, #3, etc.). 
            This number is displayed directly on the QR code image below the scannable pattern.
          </p>
          
          <div className="bg-muted p-4 rounded-md space-y-3">
            <div>
              <p className="text-sm font-semibold mb-1">Why Numbering Matters:</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Quickly identify which QR code is which when you have multiple codes</li>
                <li>Easy organization for printed materials (e.g., "Use QR code #5 for the poster")</li>
                <li>Reference specific codes in team communications</li>
                <li>Track which physical codes are performing best</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-md">
            <p className="text-sm font-semibold mb-2">Example:</p>
            <p className="text-sm">
              If you create three QR codes for different marketing campaigns, they'll be numbered #1, #2, and #3. 
              When you download QR code #2, you'll see the number displayed on the image, making it easy to 
              identify which campaign it belongs to.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* How Dynamic QR Codes Work */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How Dynamic QR Codes Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Traditional QR codes encode the destination URL directly into the pattern. Dynamic QR codes 
            work differently - they point to a tracking URL that then redirects to your chosen destination.
          </p>

          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-semibold mb-1">1. What's Encoded in the QR Code</p>
              <p className="text-sm text-muted-foreground">
                Your QR code contains a tracking URL (e.g., /r/abc123) instead of the final destination. 
                This tracking URL never changes.
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-semibold mb-1">2. When Someone Scans</p>
              <p className="text-sm text-muted-foreground">
                The system records the scan event with a timestamp, then immediately redirects 
                the visitor to your configured destination URL.
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-semibold mb-1">3. Update Anytime</p>
              <p className="text-sm text-muted-foreground">
                Change the destination URL in the system whenever you want. All existing printed QR codes 
                will automatically redirect to the new location.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Creating QR Codes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Creating and Using QR Codes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Required Information:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li><strong>Name:</strong> A descriptive name to identify your QR code (e.g., "Product Brochure QR")</li>
              <li><strong>Redirect URL:</strong> The web address where people will go when they scan (e.g., https://example.com/product)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Optional Information:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li><strong>Description:</strong> Notes about where this QR code is used or what it's for</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Downloading Your QR Code:</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Once created, you can download the QR code image in two ways:
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Click the download icon in the QR codes table to get a PNG file</li>
              <li>The image includes the sequential number for easy identification</li>
              <li>High resolution (512x572 pixels) suitable for print and digital use</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Tracking and Analytics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Scan Tracking & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Every scan is automatically tracked with a timestamp. View detailed analytics to 
            understand how your QR codes are performing.
          </p>

          <div>
            <h4 className="font-semibold mb-2">What Gets Tracked:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Total number of scans per QR code</li>
              <li>Scan trends over time (30-day daily breakdown)</li>
              <li>Average scans per day (calculated from 30-day period)</li>
              <li>Visual chart showing scan activity patterns</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Accessing Analytics:</h4>
            <div className="space-y-2">
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-semibold mb-1">Dashboard View</p>
                <p className="text-sm text-muted-foreground">
                  See total scans in the main table. The scan count updates in real-time as people scan your codes.
                </p>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-semibold mb-1">Detailed Analytics</p>
                <p className="text-sm text-muted-foreground">
                  Click the chart icon next to any QR code to view a detailed analytics report with 
                  visualizations showing scan trends over the past 30 days.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-md">
            <p className="text-sm font-semibold mb-1">Privacy Note:</p>
            <p className="text-sm">
              The system tracks scan counts and timestamps only. No personal information about scanners 
              is collected or stored.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Step 1: Create Your QR Code</h4>
              <p className="text-sm text-muted-foreground">
                Click "Create QR Code" and fill in the name and destination URL. Add an optional 
                description to help you remember where you're using this code.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Step 2: Download the Image</h4>
              <p className="text-sm text-muted-foreground">
                Click the download icon to save the QR code image. The image will include the 
                sequential number for easy identification.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Step 3: Test Before Printing</h4>
              <p className="text-sm text-muted-foreground">
                Display the QR code on your screen and scan it with your smartphone to verify 
                it redirects to the correct destination.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Step 4: Print or Share</h4>
              <p className="text-sm text-muted-foreground">
                Add the QR code to your marketing materials, product packaging, posters, or anywhere 
                you want to provide quick access to online content.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Step 5: Monitor Performance</h4>
              <p className="text-sm text-muted-foreground">
                Check the scan count in the dashboard or click the chart icon to view detailed 
                analytics and trends from the past 30 days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <p className="font-semibold text-sm">Use descriptive names</p>
                <p className="text-sm text-muted-foreground">
                  Name your QR codes clearly so you can easily identify them later 
                  (e.g., "Trade Show Booth QR - Spring 2024" instead of "QR1").
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <p className="font-semibold text-sm">Test before mass printing</p>
                <p className="text-sm text-muted-foreground">
                  Always scan your QR code to verify it works correctly before printing 
                  large quantities or publishing widely.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <p className="font-semibold text-sm">Ensure adequate size</p>
                <p className="text-sm text-muted-foreground">
                  Print QR codes large enough to be easily scanned. A minimum of 1 inch (2.5 cm) 
                  square is recommended for most uses.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <p className="font-semibold text-sm">Maintain good contrast</p>
                <p className="text-sm text-muted-foreground">
                  Print QR codes on light backgrounds for best scanning reliability. Avoid 
                  placing them on busy patterns or low-contrast backgrounds.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <p className="font-semibold text-sm">Keep destinations mobile-friendly</p>
                <p className="text-sm text-muted-foreground">
                  Since most people scan QR codes with smartphones, ensure your destination 
                  URLs lead to mobile-optimized pages.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <p className="font-semibold text-sm">Update URLs strategically</p>
                <p className="text-sm text-muted-foreground">
                  Take advantage of the dynamic nature - you can redirect codes to seasonal 
                  promotions, updated content, or new landing pages without reprinting.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <p className="font-semibold text-sm">Review analytics regularly</p>
                <p className="text-sm text-muted-foreground">
                  Check scan data to understand which codes are most effective and when 
                  people are scanning them. Use this data to optimize your marketing strategy.
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Common Use Cases */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Common Use Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-semibold mb-1">Marketing Materials</p>
              <p className="text-sm text-muted-foreground">
                Business cards, flyers, posters, and brochures - update where they lead without reprinting.
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-semibold mb-1">Product Packaging</p>
              <p className="text-sm text-muted-foreground">
                Link to product manuals, warranty registration, support pages, or promotional content.
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-semibold mb-1">Event Signage</p>
              <p className="text-sm text-muted-foreground">
                Direct attendees to schedules, registration, feedback forms, or event-specific content.
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-semibold mb-1">Restaurant Menus</p>
              <p className="text-sm text-muted-foreground">
                Provide digital menus, online ordering, or nutritional information that can be updated anytime.
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-semibold mb-1">Real Estate Listings</p>
              <p className="text-sm text-muted-foreground">
                Link yard signs to property details, virtual tours, or contact forms.
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-semibold mb-1">Educational Resources</p>
              <p className="text-sm text-muted-foreground">
                Connect printed materials to videos, supplemental content, or online assessments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="mt-8 text-center">
        <Link href="/dqm">
          <Button size="lg" data-testid="button-start-creating">
            Start Creating QR Codes
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
