"use client"

import { useMemo } from "react"
import { DEVICE_PRESETS, type DeviceId } from "@/lib/preview-presets"
import { DiveShopSite } from "@/templates/default"
import { useSite } from "./site-context"

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

  const src = `${window.location.origin}?device=${previewDimension}`

  return <Viewport src={src} device={previewDimension} className="h-screen" />
}

function Viewport({ src, device, className = "" }: ViewportProps) {
  const preset = useMemo(() => DEVICE_PRESETS.find((p) => p.id === device)!, [device])
  const vw = preset.w
  const vh = preset.h

  const scale = useMemo(() => {
    if (device === "mobile") {
      return 1
    }

    return 0.88
  }, [device])

  return (
    <div className={`relative grid h-full w-full place-items-center bg-neutral-100 ${className}`}>
      <div
        className="rounded-xl bg-white shadow-2xl"
        style={{
          width: vw,
          height: vh,
          transform: `scale(${scale})`,
          marginTop: -60
        }}
      >
        <iframe
          title="preview"
          src={src}
          className="h-full w-full rounded-xl"
          style={{ border: 0 }}
        />
      </div>
    </div>
  )
}
