import { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { apiService } from "../services/api.service"
import { useRouter } from "expo-router"
import { ActivityResponse } from "../../../packages/shared/src"

const { height } = Dimensions.get("window")

export default function HomeScreen() {
  const router = useRouter()
  const [activities, setActivities] = useState<ActivityResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)

      const data = await apiService.getActivities()
      setActivities(data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch activities")
      console.error("Error fetching activities:", err)
    } finally {
      setLoading(false)
    }
  }

  const validMarkers = activities.filter(
    (activity) =>
      activity.location.latitude !== null &&
      activity.location.longitude !== null
  )

  const initialRegion = {
    latitude: 46.5197,
    longitude: 6.6323,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  }

  const onActivityPress = (activity: ActivityResponse) => {
    setSelectedActivity(activity.id)

    // Switch to map view and focus on the location
    if (activity.location.latitude && activity.location.longitude) {
      setViewMode("map")

      // Use setTimeout to ensure the map is rendered before animating
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: activity.location.latitude!,
              longitude: activity.location.longitude!,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            },
            350
          )
        }
      }, 100)
    }
  }

  const renderActivityCard = ({ item }: { item: ActivityResponse }) => {
    const isSelected = selectedActivity === item.id
    return (
      <TouchableOpacity
        className={`bg-white rounded-2xl p-4 mb-3 border ${
          isSelected ? "border-blue-600 border-2 bg-blue-50" : "border-gray-200"
        } shadow-sm`}
        onPress={() => onActivityPress(item)}
        activeOpacity={0.7}
      >
        <View className="mb-2">
          <View className="flex-row items-center gap-2 flex-wrap">
            <Text
              className="text-lg font-bold text-gray-900 flex-1"
              numberOfLines={1}
            >
              {item.name}
            </Text>
            {item.category && item.category.length > 0 && (
              <View className="bg-blue-100 px-3 py-1 rounded-xl">
                <Text className="text-xs font-semibold text-blue-600">
                  {item.category[0]}
                </Text>
              </View>
            )}
          </View>
        </View>

        {item.description && (
          <Text
            className="text-sm text-gray-600 leading-5 mb-3"
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}

        <View className="flex-row flex-wrap gap-3">
          {item.location.city && (
            <View className="flex-row items-center gap-1">
              <Text className="text-sm">📍</Text>
              <Text className="text-xs text-gray-700 font-medium">
                {item.location.city}
              </Text>
            </View>
          )}
          {item.startTime && (
            <View className="flex-row items-center gap-1">
              <Text className="text-sm">📅</Text>
              <Text className="text-xs text-gray-700 font-medium">
                {new Date(item.startTime).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </Text>
            </View>
          )}
          {item.price && (
            <View className="flex-row items-center gap-1">
              <Text className="text-sm">💰</Text>
              <Text className="text-xs text-gray-700 font-medium">
                {item.price}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-3 text-base text-gray-600 font-medium">
          Chargement...
        </Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-white">
        <Text className="text-5xl mb-4">😕</Text>
        <Text className="text-base text-red-500 text-center mb-6">{error}</Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-lg"
          onPress={fetchActivities}
        >
          <Text className="text-white text-base font-semibold">Réessayer</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Navigation Bar */}
      <View className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-lg border-b border-gray-200 pt-12 pb-3 px-4">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            className="flex-1 bg-green-600 py-3 rounded-xl mr-2 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-bold">🏠 Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-gray-100 py-3 rounded-xl ml-2 items-center"
            onPress={() => router.push("/contact")}
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 text-base font-bold">
              📧 Contact
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toggle Button */}
      <TouchableOpacity
        className="absolute top-[120px] right-4 z-20 bg-white rounded-3xl px-4 py-3 flex-row items-center gap-2 shadow-lg"
        onPress={() => setViewMode(viewMode === "map" ? "list" : "map")}
        activeOpacity={0.8}
      >
        <Text className="text-base font-semibold text-gray-800">
          {viewMode === "map" ? "📋 Liste" : "🗺️ Carte"}
        </Text>
        <View className="bg-blue-600 px-2 py-0.5 rounded-xl">
          <Text className="text-white text-xs font-bold">
            {activities.length}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Map View */}
      {viewMode === "map" && (
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton
        >
          {validMarkers.map((activity) => (
            <Marker
              key={activity.id}
              coordinate={{
                latitude: activity.location.latitude!,
                longitude: activity.location.longitude!,
              }}
              onPress={() => onActivityPress(activity)}
              pinColor={
                selectedActivity === activity.id ? "#2563eb" : "#ef4444"
              }
            ></Marker>
          ))}
        </MapView>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <View className="flex-1 bg-white pt-[110px]">
          <View className="px-5 py-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-900">
              Activités à Vaud
            </Text>
          </View>
          <FlatList
            data={activities}
            renderItem={renderActivityCard}
            keyExtractor={(item) => item.id}
            className="p-4 pb-8"
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  )
}
