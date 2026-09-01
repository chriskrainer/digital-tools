import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Link2, BarChart3, Share2, MousePointerClick } from "lucide-react";
import { Link } from "wouter";
import workflowDiagram from "@assets/generated_images/UTM_Builder_workflow_diagram_887df630.png";

export default function UtmBuilderInstructions() {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <Link href="/utm-builder">
          <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back-to-builder">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to UTM Builder
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">How UTM Builder Works</h1>
        <p className="text-muted-foreground">
          Learn how to create trackable marketing URLs and measure campaign performance
        </p>
      </div>

      {/* Visual Diagram */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>UTM Builder Workflow</CardTitle>
          <CardDescription>
            From campaign creation to analytics tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <img 
            src={workflowDiagram} 
            alt="UTM Builder workflow diagram showing the complete process from campaign creation to analytics tracking" 
            className="w-full rounded-lg border"
            data-testid="img-workflow-diagram"
          />
        </CardContent>
      </Card>

      {/* What is UTM Builder */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            What is UTM Builder?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            UTM Builder helps you create trackable URLs for your marketing campaigns. 
            It adds special tracking parameters (called UTM parameters) to your links, 
            allowing you to see exactly where your visitors are coming from.
          </p>
          <div className="bg-muted p-4 rounded-md">
            <p className="font-semibold mb-2">Example:</p>
            <p className="text-sm mb-1">Original URL:</p>
            <code className="text-sm bg-background px-2 py-1 rounded">https://example.com/product</code>
            <p className="text-sm mt-3 mb-1">With UTM parameters:</p>
            <code className="text-sm bg-background px-2 py-1 rounded break-all">
              https://example.com/product?utm_source=newsletter&utm_medium=email&utm_campaign=spring2024
            </code>
          </div>
        </CardContent>
      </Card>

      {/* UTM Parameters Explained */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>UTM Parameters Explained</CardTitle>
          <CardDescription>
            Understanding the five standard UTM parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Source (Required)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Identifies where the traffic is coming from.
              </p>
              <p className="text-sm">
                <span className="font-medium">Examples:</span> google, newsletter, facebook, linkedin
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Medium (Required)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Describes the marketing channel or type of link.
              </p>
              <p className="text-sm">
                <span className="font-medium">Examples:</span> email, social, cpc (cost-per-click), banner
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Campaign (Required)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                The name of your specific marketing campaign.
              </p>
              <p className="text-sm">
                <span className="font-medium">Examples:</span> spring_sale, product_launch, black_friday
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Term (Optional)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Used to track paid search keywords.
              </p>
              <p className="text-sm">
                <span className="font-medium">Examples:</span> automation_software, crm_tools
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Content (Optional)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Helps differentiate similar content or links in the same campaign.
              </p>
              <p className="text-sm">
                <span className="font-medium">Examples:</span> header_link, footer_cta, red_button
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Short Codes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Custom Short Codes
          </CardTitle>
          <CardDescription>
            Create memorable, shareable tracking links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Each campaign includes a custom short code that creates a compact, 
            memorable tracking link. Instead of sharing long URLs with UTM parameters, 
            you can share a clean short link.
          </p>
          
          <div className="bg-muted p-4 rounded-md space-y-3">
            <div>
              <p className="text-sm font-semibold mb-1">Short Code Rules:</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>3-20 characters long</li>
                <li>Lowercase letters, numbers, hyphens, and underscores only</li>
                <li>Must be unique (no duplicates)</li>
                <li>Cannot be changed after creation</li>
              </ul>
            </div>
            
            <div>
              <p className="text-sm font-semibold mb-1">Example Short Code:</p>
              <code className="text-sm bg-background px-2 py-1 rounded">summer2024</code>
              <p className="text-sm mt-2">Creates tracking link:</p>
              <code className="text-sm bg-background px-2 py-1 rounded">/c/summer2024</code>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-md">
            <p className="text-sm font-semibold mb-2 flex items-center gap-2">
              <MousePointerClick className="w-4 h-4" />
              How It Works:
            </p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Visitor clicks your short tracking link</li>
              <li>System records the visit in analytics</li>
              <li>Visitor is redirected to the full UTM URL</li>
              <li>Your analytics platform tracks the UTM parameters</li>
            </ol>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-md">
            <p className="text-sm font-semibold mb-1">⚠️ Important:</p>
            <p className="text-sm">
              Always share the <strong>short tracking link</strong> (/c/your-code) to track visits. 
              If you share the full UTM URL directly, visits won't be recorded in the UTM Builder analytics.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Tracking & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Every time someone clicks your tracking link, the visit is recorded. 
            You can view detailed analytics to understand campaign performance.
          </p>

          <div>
            <h4 className="font-semibold mb-2">What Gets Tracked:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Total number of visits per campaign</li>
              <li>Visit trends over time (daily breakdown)</li>
              <li>Average visits per day</li>
              <li>Visit history for customizable date ranges (1-365 days)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Two Levels of Analytics:</h4>
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-semibold mb-1">1. UTM Builder Analytics</p>
                <p className="text-sm text-muted-foreground">
                  Track clicks on your short links. See which campaigns are getting the most traffic 
                  and when people are clicking your links.
                </p>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-semibold mb-1">2. Your Analytics Platform</p>
                <p className="text-sm text-muted-foreground">
                  Once visitors reach your destination URL, your existing analytics tools 
                  (Google Analytics, etc.) will track the UTM parameters to show you campaign performance, 
                  conversions, and other detailed metrics.
                </p>
              </div>
            </div>
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
              <h4 className="font-semibold mb-2">Step 1: Create a Campaign</h4>
              <p className="text-sm text-muted-foreground">
                Click "Create Campaign" and fill in your destination URL, UTM parameters, 
                and a unique short code.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Step 2: Copy Your Tracking Link</h4>
              <p className="text-sm text-muted-foreground">
                Once created, copy the short tracking link (e.g., /c/summer2024). 
                This is what you'll share in your marketing materials.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Step 3: Share & Track</h4>
              <p className="text-sm text-muted-foreground">
                Use your tracking link in emails, social media posts, ads, or anywhere else. 
                Every click will be recorded in the analytics dashboard.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Step 4: Monitor Performance</h4>
              <p className="text-sm text-muted-foreground">
                Click the chart icon next to any campaign to view detailed visit analytics 
                and trends over time.
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
                <p className="font-semibold text-sm">Use consistent naming conventions</p>
                <p className="text-sm text-muted-foreground">
                  Stick to a standard format for UTM parameters to make analysis easier 
                  (e.g., always lowercase, use underscores instead of spaces).
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <p className="font-semibold text-sm">Choose memorable short codes</p>
                <p className="text-sm text-muted-foreground">
                  Use descriptive codes that relate to your campaign 
                  (e.g., "spring-sale" instead of "ss123").
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <p className="font-semibold text-sm">Test your links</p>
                <p className="text-sm text-muted-foreground">
                  Always test tracking links before sharing them publicly to ensure 
                  they redirect correctly.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <p className="font-semibold text-sm">Review analytics regularly</p>
                <p className="text-sm text-muted-foreground">
                  Check your campaign performance weekly to identify what's working 
                  and optimize your marketing strategy.
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="mt-8 text-center">
        <Link href="/utm-builder">
          <Button size="lg" data-testid="button-start-building">
            Start Building Campaigns
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
