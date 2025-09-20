import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Form, FormInput } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

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

interface ManualInputProps {
  form: UseFormReturn<ShopFormData>
  isLoading: boolean
  onSubmit: (data: ShopFormData) => void
  onBack: () => void
}

export function ManualInput({ form, isLoading, onSubmit, onBack }: ManualInputProps) {
  return (
    <div className="space-y-6">
      <PageHeader title="Create Your Shop" description="Enter your shop details to get started." />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential details about your dive shop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput
                  name="name"
                  label="Shop Name"
                  placeholder="Enter your dive shop name"
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
                <FormInput
                  name="email"
                  label="Email"
                  placeholder="Your contact email"
                  rules={{
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address"
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Connect your social profiles (optional)</CardDescription>
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
