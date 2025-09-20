import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Form, FormInput } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, RefreshCw, Loader2 } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { ScrapedSiteData } from "@/app/api/scrape-domain/route"

interface DomainData {
  domain: string
  scrapedData?: ScrapedSiteData
}

interface ShopFormData {
  name: string
  description: string
  address: string
  phoneNumber: string
  email: string
  facebookUrl: string
  instagramUrl: string
  whatsappUrl: string
}

interface ConfirmationStepProps {
  form: UseFormReturn<ShopFormData>
  domainData: DomainData
  isLoading: boolean
  onSubmit: (data: ShopFormData) => void
  onBack: () => void
  onTryDifferentDomain: () => void
}

export function ConfirmationStep({
  form,
  domainData,
  isLoading,
  onSubmit,
  onBack,
  onTryDifferentDomain
}: ConfirmationStepProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Confirm Your Details"
        description="Review the information we found and make any necessary changes."
      />

      {domainData.scrapedData && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Successfully analyzed {domainData.domain}
                  </CardTitle>
                  <CardDescription>
                    Found {domainData.scrapedData.pages?.length || 0} pages and extracted key
                    information
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={onTryDifferentDomain}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Different Domain
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domainData.scrapedData.pages && domainData.scrapedData.pages.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Pages found:</p>
                    <div className="flex flex-wrap gap-1">
                      {domainData.scrapedData.pages.map((page, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {page.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(domainData.scrapedData.primaryColor || domainData.scrapedData.secondaryColor || domainData.scrapedData.accentColor) && (
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Theme colors extracted:</p>
                    <div className="flex gap-3">
                      {domainData.scrapedData.primaryColor && (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-8 w-8 rounded border"
                            style={{ backgroundColor: domainData.scrapedData.primaryColor }}
                          />
                          <div className="text-xs">
                            <div className="font-medium">Primary</div>
                            <div className="text-muted-foreground">{domainData.scrapedData.primaryColor}</div>
                          </div>
                        </div>
                      )}
                      {domainData.scrapedData.secondaryColor && (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-8 w-8 rounded border"
                            style={{ backgroundColor: domainData.scrapedData.secondaryColor }}
                          />
                          <div className="text-xs">
                            <div className="font-medium">Secondary</div>
                            <div className="text-muted-foreground">{domainData.scrapedData.secondaryColor}</div>
                          </div>
                        </div>
                      )}
                      {domainData.scrapedData.accentColor && (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-8 w-8 rounded border"
                            style={{ backgroundColor: domainData.scrapedData.accentColor }}
                          />
                          <div className="text-xs">
                            <div className="font-medium">Accent</div>
                            <div className="text-muted-foreground">{domainData.scrapedData.accentColor}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your shop's primary details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput
                  name="name"
                  label="Shop Name"
                  placeholder="Enter your shop name"
                  rules={{ required: "Shop name is required" }}
                />
                <FormInput
                  name="description"
                  label="Description"
                  placeholder="Brief description of your dive shop"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How customers can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput name="address" label="Address" placeholder="Your shop's address" />
                <FormInput
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Your contact number"
                />
                <FormInput name="email" label="Email" placeholder="Your contact email" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Connect your social profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput
                  name="facebookUrl"
                  label="Facebook URL"
                  placeholder="https://facebook.com/yourshop"
                />
                <FormInput
                  name="instagramUrl"
                  label="Instagram URL"
                  placeholder="https://instagram.com/yourshop"
                />
                <FormInput
                  name="whatsappUrl"
                  label="WhatsApp URL"
                  placeholder="https://wa.me/1234567890"
                />
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Shop...
                  </>
                ) : (
                  "Create Shop"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
