"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreateActivityDto } from "@vaudly/shared"
import { CategoryType } from "@vaudly/database"
import dynamic from "next/dynamic"
const MiniMap = dynamic(() => import("../../components/MiniMap"), {
  ssr: false,
})

export default function AddActivityPage() {
  const router = useRouter()
  const [form, setForm] = useState<CreateActivityDto>({
    name: "",
    description: "",
    category: typeof CategoryType !== "undefined" ? [] : [],
    price: "",
    date: "",
    location: {
      name: "",
      address: "",
      city: "",
      canton: "",
      latitude: null,
      longitude: null,
    },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name.startsWith("location.")) {
      const locField = name.replace("location.", "")
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locField]:
            locField === "latitude" || locField === "longitude"
              ? value === ""
                ? null
                : parseFloat(value)
              : value,
        },
      }))
    } else if (name === "category") {
      setForm((prev) => ({
        ...prev,
        category: value
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to add activity")
      router.push("/activities")
    } catch (e: any) {
      setError(e.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Add Activity</h1>
      {/* MiniMap for location selection */}
      <div className="mb-4">
        <span className="text-gray-700 block mb-1">
          Location (select on map)
        </span>
        <MiniMap
          lat={form.location.latitude ?? 46.8182}
          lng={form.location.longitude ?? 8.2275}
          onChange={(newLat: number, newLng: number) => {
            setForm((prev) => ({
              ...prev,
              location: {
                ...prev.location,
                latitude: newLat,
                longitude: newLng,
              },
            }))
          }}
        />
        <div className="text-xs text-gray-500 mt-1">
          Drag the marker to set the location.
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-semibold">Latitude:</span>{" "}
          {form.location.latitude ?? "-"} <br />
          <span className="font-semibold">Longitude:</span>{" "}
          {form.location.longitude ?? "-"}
        </div>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input
            name="name"
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description</span>
          <textarea
            name="description"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={form.description}
            onChange={handleChange}
            rows={2}
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Category (comma separated)</span>
          <input
            name="category"
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={form.category.join(", ")}
            onChange={handleChange}
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Price</span>
          <input
            name="price"
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={form.price || ""}
            onChange={handleChange}
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Date</span>
          <input
            name="date"
            type="text"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900"
            value={form.date || ""}
            onChange={handleChange}
          />
        </label>
        <div className="border-t pt-4 mt-4">
          <span className="text-gray-700 font-semibold block mb-2">
            Location
          </span>
          <div className="grid grid-cols-2 gap-2">
            <input
              name="location.name"
              type="text"
              placeholder="Name"
              className="block w-full border rounded px-2 py-1 text-gray-900"
              value={form.location.name || ""}
              onChange={handleChange}
            />
            <input
              name="location.address"
              type="text"
              placeholder="Address"
              className="block w-full border rounded px-2 py-1 text-gray-900"
              value={form.location.address || ""}
              onChange={handleChange}
            />
            <input
              name="location.city"
              type="text"
              placeholder="City"
              className="block w-full border rounded px-2 py-1 text-gray-900"
              value={form.location.city || ""}
              onChange={handleChange}
            />
            <input
              name="location.canton"
              type="text"
              placeholder="Canton"
              className="block w-full border rounded px-2 py-1 text-gray-900"
              value={form.location.canton || ""}
              onChange={handleChange}
            />
            <input
              name="location.latitude"
              type="number"
              step="any"
              placeholder="Latitude"
              className="block w-full border rounded px-2 py-1 text-gray-900"
              value={form.location.latitude ?? ""}
              onChange={handleChange}
            />
            <input
              name="location.longitude"
              type="number"
              step="any"
              placeholder="Longitude"
              className="block w-full border rounded px-2 py-1 text-gray-900"
              value={form.location.longitude ?? ""}
              onChange={handleChange}
            />
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => router.push("/activities")}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Activity"}
          </button>
        </div>
      </form>
    </div>
  )
}
