import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface TaskProgress {
  percentage: number
  current: number
  total: number
  message: string
}

interface ScrapingProgressProps {
  domain: string
  progress?: TaskProgress | null
  scrapedData?: {
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
  } | null
}

export function ScrapingProgress({ domain, progress, scrapedData }: ScrapingProgressProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analyzing Your Website"
        description="Please wait while we extract content and settings from your site..."
      />

      <Card className="max-w-2xl">
        <CardContent className="py-12">
          <div className="flex flex-col items-center space-y-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h3 className="font-semibold text-lg">Analyzing {domain}</h3>

            {progress && (
              <div className="w-full max-w-md space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress.percentage}%</span>
                  </div>
                  <Progress value={progress.percentage} className="w-full" />
                  <p className="text-center text-sm text-muted-foreground">
                    {progress.message}
                  </p>
                  <p className="text-center text-xs text-muted-foreground">
                    Step {progress.current} of {progress.total}
                  </p>
                </div>
              </div>
            )}

            {!progress && (
              <p className="text-center text-muted-foreground">
                We're extracting your site's content, images, colors, and contact information. This
                usually takes a few moments...
              </p>
            )}

            {scrapedData && (scrapedData.primaryColor || scrapedData.secondaryColor || scrapedData.accentColor) && (
              <div className="w-full max-w-md space-y-3">
                <p className="text-center text-sm text-muted-foreground">Colors found:</p>
                <div className="flex justify-center gap-2">
                  {scrapedData.primaryColor && (
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: scrapedData.primaryColor }}
                      />
                      <span className="text-xs text-muted-foreground">Primary</span>
                    </div>
                  )}
                  {scrapedData.secondaryColor && (
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: scrapedData.secondaryColor }}
                      />
                      <span className="text-xs text-muted-foreground">Secondary</span>
                    </div>
                  )}
                  {scrapedData.accentColor && (
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: scrapedData.accentColor }}
                      />
                      <span className="text-xs text-muted-foreground">Accent</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}