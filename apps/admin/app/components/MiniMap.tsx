import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export default function MiniMap({
  lat,
  lng,
  onChange,
}: {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }
    const map = L.map(mapContainerRef.current).setView([lat, lng], 13)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map)
    const marker = L.marker([lat, lng], { draggable: true }).addTo(map)
    marker.on("dragend", function () {
      const newLatLng = marker.getLatLng()
      onChange(newLatLng.lat, newLatLng.lng)
    })
    markerRef.current = marker
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng])

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: 200,
        borderRadius: 8,
        overflow: "hidden",
      }}
    />
  )
}
