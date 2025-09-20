"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { createShop } from "./actions"
import { redirect } from "next/navigation"
import { toast } from "sonner"
import type { ScrapedSiteData } from "@/app/api/scrape-domain/route"
import { useScraperTask } from "@/hooks/use-scraper-task"
import { MethodSelection } from "./components/method-selection"
import { DomainInput } from "./components/domain-input"
import { ScrapingProgress } from "./components/scraping-progress"
import { ConfirmationStep } from "./components/confirmation-step"
import { ManualInput } from "./components/manual-input"

export enum CreationStep {
  METHOD = "method",
  DOMAIN_INPUT = "domain-input",
  SCRAPING = "scraping",
  CONFIRMATION = "confirmation",
  MANUAL_INPUT = "manual-input"
}

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

export default function CreateShop() {
  const [step, setStep] = useState<CreationStep>(CreationStep.METHOD)
  const [domainData, setDomainData] = useState<DomainData>({ domain: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)

  const { progress, result, partialResult, error: scraperError } = useScraperTask(currentTaskId)

  const domainForm = useForm({
    defaultValues: {
      domain: ""
    }
  })

  const manualForm = useForm<ShopFormData>({
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phoneNumber: "",
      email: "",
      facebookUrl: "",
      instagramUrl: "",
      whatsappUrl: ""
    }
  })

  const confirmationForm = useForm<ShopFormData>({
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phoneNumber: "",
      email: "",
      facebookUrl: "",
      instagramUrl: "",
      whatsappUrl: ""
    }
  })

  const handleScrapeForm = async (data: { domain: string }) => {
    setIsLoading(true)
    setStep(CreationStep.SCRAPING)

    try {
      const response = await fetch("/api/scrape-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: data.domain })
      })

      const result = await response.json()

      if (result.success && result.taskId) {
        setCurrentTaskId(result.taskId)
        setDomainData({ domain: result.domain })
        // The SSE hook will handle the rest of the flow
      } else {
        toast.error(result.error || "Failed to start scraping task")
        setStep(CreationStep.DOMAIN_INPUT)
      }
    } catch {
      toast.error("Failed to scrape domain. Please try again.")
      setStep(CreationStep.DOMAIN_INPUT)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle SSE scraping results
  useEffect(() => {
    if (result && !scraperError) {
      setDomainData((prev) => ({ ...prev, scrapedData: result }))

      confirmationForm.reset({
        name: result.name,
        description: result.description,
        address: result.address,
        phoneNumber: result.phoneNumber,
        email: result.email,
        facebookUrl: result.facebookUrl,
        instagramUrl: result.instagramUrl,
        whatsappUrl: result.whatsappUrl
      })

      setStep(CreationStep.CONFIRMATION)
      setIsLoading(false)
    } else if (scraperError) {
      toast.error(scraperError)
      setStep(CreationStep.DOMAIN_INPUT)
      setIsLoading(false)
    }
  }, [result, scraperError, confirmationForm])

  const handleCreateFromScrapedData = async (formData: ShopFormData) => {
    setIsLoading(true)

    const siteSettings = {
      name: formData.name,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      facebookUrl: formData.facebookUrl,
      instagramUrl: formData.instagramUrl,
      whatsappUrl: formData.whatsappUrl,
      logoUrl: domainData.scrapedData?.logoUrl || "",
      faviconUrl: domainData.scrapedData?.faviconUrl || "",
      primaryColor: domainData.scrapedData?.primaryColor || "#3b82f6",
      secondaryColor: domainData.scrapedData?.secondaryColor || "#64748b",
      accentColor: domainData.scrapedData?.accentColor || "#f59e0b"
    }

    const result = await createShop(formData.name, domainData.domain, siteSettings)

    if (result.success && result.shop?.id) {
      toast.success("Shop created successfully!")
      redirect(`/dashboard/shops/${result.shop.id}`)
    } else {
      toast.error(`Failed to create shop: ${result.error}`)
      setIsLoading(false)
    }
  }

  const handleCreateManual = async (formData: ShopFormData) => {
    setIsLoading(true)

    const result = await createShop(formData.name, "", formData)

    if (result.success && result.shop?.id) {
      toast.success("Shop created successfully!")
      redirect(`/dashboard/shops/${result.shop.id}`)
    } else {
      toast.error(`Failed to create shop: ${result.error}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl">
      {step === CreationStep.METHOD && <MethodSelection onSelectMethod={setStep} />}
      {step === CreationStep.DOMAIN_INPUT && (
        <DomainInput
          form={domainForm}
          isLoading={isLoading}
          onSubmit={handleScrapeForm}
          onBack={() => setStep(CreationStep.METHOD)}
        />
      )}
      {step === CreationStep.SCRAPING && (
        <ScrapingProgress
          domain={domainData.domain}
          progress={progress}
          scrapedData={partialResult}
        />
      )}
      {step === CreationStep.CONFIRMATION && (
        <ConfirmationStep
          form={confirmationForm}
          domainData={domainData}
          isLoading={isLoading}
          onSubmit={handleCreateFromScrapedData}
          onBack={() => setStep(CreationStep.DOMAIN_INPUT)}
          onTryDifferentDomain={() => {
            setStep(CreationStep.DOMAIN_INPUT)
            domainForm.reset()
          }}
        />
      )}
      {step === CreationStep.MANUAL_INPUT && (
        <ManualInput
          form={manualForm}
          isLoading={isLoading}
          onSubmit={handleCreateManual}
          onBack={() => setStep(CreationStep.METHOD)}
        />
      )}
    </div>
  )
}
