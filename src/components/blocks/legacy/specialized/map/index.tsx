import type { MapContent } from "../../../shared/schemas"

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

const defaultContent: MapContent = {
  title: "Set your map title here",
  address: "123 Main St, City, State 12345"
}

export const MapBlock = ({ content = defaultContent }: { content?: MapContent }) => {
  const { title, description, address, latitude, longitude, zoom = 15, height = 400 } = content

  const mapUrl =
    latitude && longitude
      ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=${zoom}`
      : `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}&zoom=${zoom}`

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="mb-12 text-center">
            {title && <h2 className="mb-4 font-bold text-3xl md:text-4xl">{title}</h2>}
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>
        )}

        <div className="mx-auto max-w-4xl">
          <div className="w-full overflow-hidden rounded-lg" style={{ height: `${height}px` }}>
            {apiKey ? (
              <iframe
                src={mapUrl}
                title="Location Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <p className="text-muted-foreground">
                  Google Maps API key is required to display the map.
                </p>
              </div>
            )}
          </div>

          {address && (
            <div className="mt-4 text-center">
              <p className="text-muted-foreground">{address}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
