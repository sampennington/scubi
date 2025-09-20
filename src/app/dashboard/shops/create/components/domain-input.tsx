import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Form, FormInput } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Loader2 } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

interface DomainInputProps {
  form: UseFormReturn<{ domain: string }>
  isLoading: boolean
  onSubmit: (data: { domain: string }) => void
  onBack: () => void
}

export function DomainInput({ form, isLoading, onSubmit, onBack }: DomainInputProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Enter Your Website Domain"
        description="We'll analyze your current website to extract content and settings."
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Website Domain
          </CardTitle>
          <CardDescription>
            Enter your current website URL (e.g., yourshop.com or www.yourshop.com)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                name="domain"
                label="Domain or URL"
                placeholder="example.com or https://www.example.com"
                rules={{
                  required: "Domain is required",
                  pattern: {
                    value:
                      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}(\/.*)?$/,
                    message: "Please enter a valid domain (e.g., dive-shop.com)"
                  }
                }}
              />
              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Website"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={onBack}>
                  Back
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
