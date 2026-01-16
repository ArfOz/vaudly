"use client"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
const MiniMap = dynamic(() => import("../components/MiniMap"), {
  ssr: false,
})

export default function EditActivityPage() {
  const router = useRouter()
  const params = useParams()
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : ""
  const [activity, setActivity] = useState<any>(null)
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/activities/${id}`
        )
        if (!res.ok) throw new Error("Activity not found")
        const data = await res.json()
        setActivity(data)
        setForm(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchActivity()
  }, [id])

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>
  if (!form) return null

  const lat = form.location?.latitude ?? 46.8182
  const lng = form.location?.longitude ?? 8.2275

  const handleSave = async () => {
    // TODO: send PATCH request to API
    alert("Save: " + JSON.stringify(form, null, 2))
    router.push("/")
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Edit Activity</h1>
      <div className="mb-4">
        <span className="text-gray-700 block mb-1">Location</span>
        <MiniMap
          lat={lat}
          lng={lng}
          onChange={(newLat, newLng) => {
            setForm((f: any) => ({
              ...f,
              location: {
                ...(f.location || {}),
                id: f.location?.id || activity?.location?.id || "",
                latitude: newLat,
                longitude: newLng,
                name: f.location?.name ?? activity?.location?.name ?? null,
                address:
                  f.location?.address ?? activity?.location?.address ?? null,
                city: f.location?.city ?? activity?.location?.city ?? null,
                canton: f.location?.canton ?? activity?.location?.canton ?? "",
              },
            }))
          }}
        />
        <div className="text-xs text-gray-500 mt-1">
          Drag the marker to change the location.
        </div>
      </div>
      <div className="space-y-3">
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={form.name || ""}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, name: e.target.value }))
            }
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description</span>
          <textarea
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={form.description || ""}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, description: e.target.value }))
            }
            rows={2}
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Category</span>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={Array.isArray(form.category) ? form.category.join(", ") : ""}
            onChange={(e) =>
              setForm((f: any) => ({
                ...f,
                category: e.target.value
                  .split(",")
                  .map((c: string) => c.trim()),
              }))
            }
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Price</span>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={form.price || ""}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, price: e.target.value }))
            }
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Date</span>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={form.date || ""}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, date: e.target.value }))
            }
          />
        </label>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save
        </button>
      </div>
    </div>
  )
}
