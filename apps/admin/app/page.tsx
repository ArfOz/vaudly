"use client"

import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"

const MapView = dynamic(() => import("./components/MapView"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
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

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Activity>>({})
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  )
  const activityRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({})

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activities`
      )
      if (!response.ok) throw new Error("Failed to fetch activities")
      const data = await response.json()
      setActivities(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (activity: Activity) => {
    setEditingId(activity.id)
    setEditForm(activity)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activities/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editForm.name,
            description: editForm.description,
            subtitle: editForm.subtitle,
            date: editForm.date,
            price: editForm.price,
            category: editForm.category,
          }),
        }
      )

      if (!response.ok) throw new Error("Failed to update activity")

      await fetchActivities()
      setEditingId(null)
      setEditForm({})
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save changes")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activities/${id}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) throw new Error("Failed to delete activity")

      await fetchActivities()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete activity")
    }
  }

  const handleMapActivityClick = (activity: Activity) => {
    setSelectedActivityId(activity.id)
    // Scroll to list view
    setTimeout(() => {
      const element = activityRefs.current[activity.id]
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Activities Management
        </h1>

        {/* Map */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Map View</h2>
          <MapView
            activities={activities}
            onActivityClick={handleMapActivityClick}
          />
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b border-gray-200 text-gray-900">
            List View
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr
                    key={activity.id}
                    ref={(el) => {
                      activityRefs.current[activity.id] = el
                    }}
                    className={
                      selectedActivityId === activity.id ? "bg-yellow-100" : ""
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === activity.id ? (
                        <input
                          type="text"
                          value={editForm.name || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {activity.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === activity.id ? (
                        <textarea
                          value={editForm.description || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full"
                          rows={2}
                        />
                      ) : (
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {activity.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === activity.id ? (
                        <input
                          type="text"
                          value={editForm.category?.join(", ") || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value
                                .split(",")
                                .map((c) => c.trim()),
                            })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="text-sm text-gray-500">
                          {activity.category?.join(", ") || "-"}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === activity.id ? (
                        <input
                          type="text"
                          value={editForm.price || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              price: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="text-sm text-gray-500">
                          {activity.price || "-"}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === activity.id ? (
                        <input
                          type="text"
                          value={editForm.date || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, date: e.target.value })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="text-sm text-gray-500">
                          {activity.date || "-"}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {activity.location?.name ||
                          activity.location?.city ||
                          "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === activity.id ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleSave(activity.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(activity)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(activity.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {activities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No activities found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
