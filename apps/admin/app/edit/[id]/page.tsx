"use client"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
const MiniMap = dynamic(() => import("../../components/MiniMap"), {
  ssr: false,
})
import { ActivityResponse } from "@vaudly/shared"

export default function EditActivityPage() {
  const router = useRouter()
  const params = useParams()
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : ""
  const [activity, setActivity] = useState<ActivityResponse | null>(null)
  const [form, setForm] = useState<ActivityResponse | null>(null)
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
        const data: ActivityResponse = await res.json()
        setActivity(data)
        setForm(data)
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError("An unknown error occurred")
        }
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

  const handleReset = () => {
    setForm(activity)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this activity?")) return
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activities/${id}`,
        { method: "DELETE" }
      )
      if (!res.ok) throw new Error("Failed to delete activity")
      router.push("/activities")
    }
    catch (e: unknown) {
      if (e instanceof Error) {
        alert("Error: " + e.message)
      } else {
        alert("An unknown error occurred")
      }
  }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Edit Activity</h1>
      {/* Move MiniMap above the form */}
      <div className="mb-4">
        <span className="text-gray-700 block mb-1">Location</span>
        <MiniMap
          lat={lat}
          lng={lng}
          onChange={(newLat: number, newLng: number) => {
            setForm((f) =>
              f
                ? {
                    ...f,
                    location: {
                      ...(f.location || {}),
                      id: f.location?.id || activity?.location?.id || "",
                      latitude: newLat,
                      longitude: newLng,
                      name:
                        f.location?.name ?? activity?.location?.name ?? null,
                      address:
                        f.location?.address ??
                        activity?.location?.address ??
                        null,
                      city:
                        f.location?.city ?? activity?.location?.city ?? null,
                      canton:
                        f.location?.canton ?? activity?.location?.canton ?? "",
                    },
                  }
                : f
            )
          }}
        />
        <div className="text-xs text-gray-500 mt-1">
          Drag the marker to change the location.
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-semibold">Latitude:</span>{" "}
          {form.location?.latitude ?? "-"} <br />
          <span className="font-semibold">Longitude:</span>{" "}
          {form.location?.longitude ?? "-"}
        </div>
      </div>
      {/* Form fields below the map */}
      <div className="space-y-3">
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={form?.name || ""}
            onChange={(e) =>
              setForm((f) => (f ? { ...f, name: e.target.value } : f))
            }
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description</span>
          <textarea
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={form?.description || ""}
            onChange={(e) =>
              setForm((f) => (f ? { ...f, description: e.target.value } : f))
            }
            rows={2}
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Category</span>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={
              Array.isArray(form?.category) ? form?.category.join(", ") : ""
            }
            onChange={(e) =>
              setForm((f) =>
                f
                  ? {
                      ...f,
                      category: e.target.value
                        .split(",")
                        .map((c: string) => c.trim()),
                    }
                  : f
              )
            }
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Price</span>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={form?.price || ""}
            onChange={(e) =>
              setForm((f) => (f ? { ...f, price: e.target.value } : f))
            }
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Date</span>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={form?.date || ""}
            onChange={(e) =>
              setForm((f) => (f ? { ...f, date: e.target.value } : f))
            }
          />
        </label>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
        >
          Delete
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-gray-900"
        >
          Reset
        </button>
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
