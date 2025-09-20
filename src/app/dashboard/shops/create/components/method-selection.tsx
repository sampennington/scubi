import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Plus, CheckCircle } from "lucide-react"
import { CreationStep } from "../page"

interface MethodSelectionProps {
  onSelectMethod: (method: CreationStep) => void
}

export function MethodSelection({ onSelectMethod }: MethodSelectionProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Your Dive Shop Website"
        description="Choose how you'd like to get started with your new website."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card
          className="cursor-pointer transition-colors hover:bg-accent/50"
          onClick={() => onSelectMethod(CreationStep.DOMAIN_INPUT)}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>I have an existing website</CardTitle>
                <CardDescription>
                  We'll scrape your current site to get you started quickly
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Auto-import your content and settings
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Extract colors, images, and contact info
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Review and confirm before creating
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-colors hover:bg-accent/50"
          onClick={() => onSelectMethod(CreationStep.MANUAL_INPUT)}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <Plus className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Start from scratch</CardTitle>
                <CardDescription>
                  Manually enter your shop details and build from the ground up
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Full control over every detail
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Start with professional templates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Perfect for new businesses
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
