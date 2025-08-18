"use client"

import { useMemo, useState } from "react"
import { DEVICE_PRESETS, type DeviceId } from "@/lib/preview-presets"
import { DiveShopSite } from "@/templates/default"
import { useSite } from "./site-context"
import { Loader2 } from "lucide-react"

interface ViewportProps {
  src: string
  device: DeviceId
  className?: string
}

export function Preview() {
  const { previewDimension } = useSite()

  if (previewDimension === "desktop") {
    return <DiveShopSite />
  }

  const url = new URL(window.location.href)

  url.searchParams.set("device", previewDimension)

  return <Viewport src={url.toString()} device={previewDimension} className="h-screen" />
}

function Viewport({ src, device, className = "" }: ViewportProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const preset = useMemo(() => DEVICE_PRESETS.find((p) => p.id === device)!, [device])
  const vw = preset.w
  const vh = preset.h

  const scale = useMemo(() => {
    if (device === "mobile") {
      return 1
    }

    return 0.88
  }, [device])

  const isLoading = loadedSrc !== src

  return (
    <div className={`relative grid h-full w-full place-items-center bg-neutral-100 ${className}`}>
      <div
        className="rounded-xl bg-white shadow-lg"
        style={{
          width: vw,
          height: vh,
          transform: `scale(${scale})`,
          marginTop: -60,
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.15)"
        }}
      >
        {isLoading && (
          <Loader2 className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-12 w-12 animate-spin text-primary" />
        )}
        <iframe
          title="preview"
          src={src}
          className={`h-full w-full rounded-xl ${isLoading ? "invisible" : ""}`}
          style={{ border: 0 }}
          onLoad={() => {
            setLoadedSrc(src)
          }}
        />
      </div>
    </div>
  )
}
