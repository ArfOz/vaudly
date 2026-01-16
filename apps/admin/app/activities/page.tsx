"use client"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { ActivityResponse } from "@vaudly/shared"
// MiniMap removed, no longer used
const MapView = dynamic(() => import("../components/MapView"), { ssr: false })

export default function Home() {
  const [activities, setActivities] = useState<ActivityResponse[]>([])
  const [loading, setLoading] = useState(true)
  // Error state removed, not used
  // Drawer state removed
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  )
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityResponse | null>(null)
  const activityRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({})
  // Replace 'any' with 'unknown' for safer typing, or define a proper type/interface for the MapView ref
  const mapViewRef = useRef<unknown>(null)

  // Fetch activities from API
  const fetchActivities = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activities`
      )
      if (!response.ok) throw new Error("Failed to fetch activities")
      const data: ActivityResponse[] = await response.json()
      setActivities(data)
    } catch {
      // On error, only disable loading
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const handleMapActivityClick = (activity: ActivityResponse) => {
    setSelectedActivityId(activity.id)
    setSelectedActivity(activity)
    setTimeout(() => {
      const element = activityRefs.current[activity.id]
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  const handleRowClick = (activity: ActivityResponse) => {
    setSelectedActivityId(activity.id)
    setSelectedActivity(activity)
  }

  // Map reset function
  const handleResetMap = () => {
    if (
      mapViewRef.current &&
      typeof (mapViewRef.current as { resetMap?: () => void }).resetMap ===
        "function"
    ) {
      ;(mapViewRef.current as { resetMap: () => void }).resetMap()
    }
    setSelectedActivityId(null)
    setSelectedActivity(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          Activities Management
        </h1>
        {/* Vertical layout, reduced heights */}
        <div className="flex flex-col gap-4 min-h-0 h-[calc(100vh-80px)]">
          {/* Top: Map */}
          <div className="bg-white rounded-lg shadow p-2 flex-1 flex flex-col min-h-0 h-[35vh]">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              Map View
            </h2>
            <div className="flex-1 min-h-0">
              <MapView
                ref={mapViewRef}
                activities={activities}
                onActivityClick={handleMapActivityClick}
                selectedActivity={selectedActivity}
              />
            </div>
            <div className="mt-2 flex justify-end">
              <button
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm"
                onClick={handleResetMap}
              >
                Reset Map
              </button>
            </div>
          </div>
          {/* Bottom: List */}
          <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col min-h-0 h-[calc(65vh-40px)]">
            <h2 className="text-lg font-semibold px-4 py-2 border-b border-gray-200 text-gray-900">
              List View
            </h2>
            <div className="overflow-y-auto flex-1">
              <table className="w-full table-fixed border border-gray-200 divide-y divide-gray-200">
                <thead className="bg-white sticky top-0 z-20 shadow border-b border-gray-300">
                  <tr>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="max-w-30 wrap-break-word whitespace-normal">
                        Name
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="max-w-45 wrap-break-word whitespace-normal">
                        Description
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="max-w-30 wrap-break-word whitespace-normal">
                        Category
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="max-w-20 wrap-break-word whitespace-normal">
                        Price
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="max-w-25 wrap-break-word whitespace-normal">
                        Date
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="max-w-35 wrap-break-word whitespace-normal">
                        Location
                      </div>
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
                        selectedActivityId === activity.id
                          ? "bg-yellow-100 cursor-pointer"
                          : "cursor-pointer"
                      }
                    >
                      <td className="px-2 py-4 text-center">
                        <button
                          type="button"
                          aria-label="Show on map"
                          className="text-green-600 hover:text-green-800 focus:outline-none"
                          style={{ fontSize: 20 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedActivityId(activity.id)
                            setSelectedActivity(activity)
                          }}
                        >
                          🗺️
                        </button>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        onClick={() => {
                          window.location.href = `/edit/${activity.id}`
                        }}
                      >
                        <div className="text-sm font-medium text-gray-900 max-w-30 wrap-break-word whitespace-normal cursor-pointer underline">
                          {activity.name}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={() => handleRowClick(activity)}
                      >
                        <div
                          className="text-sm text-gray-500 max-w-45 whitespace-nowrap overflow-hidden text-ellipsis"
                          title={activity.description || ""}
                        >
                          {activity.description
                            ? activity.description.length > 60
                              ? activity.description.slice(0, 60) + "..."
                              : activity.description
                            : "-"}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        onClick={() => handleRowClick(activity)}
                      >
                        <div className="text-sm text-gray-500 max-w-30 wrap-break-word whitespace-normal">
                          {activity.category?.join(", ") || "-"}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        onClick={() => handleRowClick(activity)}
                      >
                        <div className="text-sm text-gray-500 max-w-20 wrap-break-word whitespace-normal">
                          {activity.price || "-"}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        onClick={() => handleRowClick(activity)}
                      >
                        <div className="text-sm text-gray-500 max-w-25 wrap-break-word whitespace-normal">
                          {activity.date || "-"}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        onClick={() => handleRowClick(activity)}
                      >
                        <div className="text-sm text-gray-500 max-w-35 wrap-break-word whitespace-normal">
                          {activity.location?.name ||
                            activity.location?.city ||
                            "-"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {activities.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No activities found yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
