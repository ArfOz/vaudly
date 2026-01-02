"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Leaflet marker ikonlarını düzelt
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

interface Location {
  id: string
  name: string | null
  address: string | null
  city: string | null
  canton: string
  latitude: number | null
  longitude: number | null
}

interface Activity {
  id: string
  name: string
  description: string | null
  subtitle: string | null
  date: string | null
  price: string | null
  startTime: string | null
  endTime: string | null
  createdAt: string
  updatedAt: string
  locationId: string
  location: Location
  category: string[]
}

interface MapViewProps {
  activities: Activity[]
  onActivityClick?: (activity: Activity) => void
}

export default function MapView({ activities, onActivityClick }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // İsviçre merkezi koordinatları
    const map = L.map(mapContainerRef.current).setView([46.8182, 8.2275], 8)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current
    const markers: L.Marker[] = []

    // Mevcut işaretleyicileri temizle
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })

    // Aktiviteleri haritaya ekle
    activities.forEach((activity) => {
      const { latitude, longitude } = activity.location

      if (latitude && longitude) {
        const marker = L.marker([latitude, longitude]).addTo(map).bindPopup(`
            <div style="max-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 8px;">${activity.name}</h3>
              ${activity.description ? `<p style="font-size: 14px; margin-bottom: 8px;">${activity.description.substring(0, 100)}${activity.description.length > 100 ? "..." : ""}</p>` : ""}
              ${activity.price ? `<p style="font-size: 14px;"><strong>Price:</strong> ${activity.price}</p>` : ""}
              ${activity.location.city ? `<p style="font-size: 14px;"><strong>City:</strong> ${activity.location.city}</p>` : ""}
              ${activity.category && activity.category.length > 0 ? `<p style="font-size: 14px;"><strong>Category:</strong> ${activity.category.join(", ")}</p>` : ""}
            </div>
          `)

        if (onActivityClick) {
          marker.on("click", () => {
            onActivityClick(activity)
          })
        }

        markers.push(marker)
      }
    })

    // Tüm işaretleyicileri gösterecek şekilde haritayı ayarla
    if (markers.length > 0) {
      const group = L.featureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.1))
    }

    return () => {
      markers.forEach((marker) => marker.remove())
    }
  }, [activities, onActivityClick])

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "600px",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  )
}
