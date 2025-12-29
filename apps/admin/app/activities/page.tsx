import React, { useEffect, useState } from "react"
import { fetchActivities } from "./activities.service"
import type { ActivityResponse } from "../../../../packages/shared/src/otherDtos"

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await fetchActivities()
        setActivities(data)
        setError("")
      } catch {
        setError("Aktiviteler yüklenemedi.")
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Activities</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>ID</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Ad</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {activity.id}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {activity.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
