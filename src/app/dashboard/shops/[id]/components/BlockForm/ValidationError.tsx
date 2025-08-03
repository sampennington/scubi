"use client"

import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ValidationErrorProps {
  errors: string[]
  title?: string
}

export function ValidationError({
  errors,
  title = "Validation Errors"
}: ValidationErrorProps) {
  return <></>
}
