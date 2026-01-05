"use client"

import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { ActivityResponse } from "@vaudly/shared"

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

interface MapViewProps {
  activities: ActivityResponse[]
  onActivityClick?: (activity: ActivityResponse) => void
  selectedActivity?: ActivityResponse | null
  height?: number | string // new prop
}

const MapView = forwardRef(
  (
    {
      activities,
      onActivityClick,
      selectedActivity,
      height = 300,
    }: MapViewProps,
    ref
  ) => {
    const mapRef = useRef<L.Map | null>(null)
    const mapContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!mapContainerRef.current || mapRef.current) return

      // Switzerland center coordinates
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

      // Remove existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })

      // Add activities to map
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

      // Fit map to show all markers
      if (markers.length > 0) {
        const group = L.featureGroup(markers)
        map.fitBounds(group.getBounds().pad(0.1))
      } else {
        // If no markers, reset map view
        map.setView([46.8182, 8.2275], 8)
      }

      // Zoom to selected activity if exists
      if (
        selectedActivity &&
        selectedActivity.location.latitude &&
        selectedActivity.location.longitude
      ) {
        map.setView(
          [
            selectedActivity.location.latitude,
            selectedActivity.location.longitude,
          ],
          15,
          { animate: true }
        )
      }

      return () => {
        markers.forEach((marker) => marker.remove())
      }
    }, [activities, onActivityClick, selectedActivity])

    useImperativeHandle(ref, () => ({
      resetMap: () => {
        if (mapRef.current) {
          mapRef.current.setView([46.8182, 8.2275], 8)
        }
      },
    }))

    return (
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: typeof height === "number" ? `${height}px` : height,
          borderRadius: "8px",
          overflow: "hidden",
        }}
        id="main-map-container"
      />
    )
  }
)

MapView.displayName = "MapView"

export default MapView
