import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import type { ActivityResponse } from "shared";
import { apiService } from "@/services/api.service";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

const CATEGORIES = [
  "FARM",
  "GARDEN",
  "RESTAURANT",
  "CAFE",
  "BAR",
  "MARKET",
  "SPORTS",
  "CULTURE",
  "NATURE",
  "ENTERTAINMENT",
  "EDUCATION",
  "WELLNESS",
  "FAMILY",
  "ADVENTURE",
  "MUSIC",
  "ART",
  "FESTIVAL",
  "SHOPPING",
  "NIGHTLIFE",
  "OTHER",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  FARM: "🌾 Ferme",
  GARDEN: "🌿 Jardin",
  RESTAURANT: "🍽️ Restaurant",
  CAFE: "☕ Café",
  BAR: "🍺 Bar",
  MARKET: "🛒 Marché",
  SPORTS: "⚽ Sport",
  CULTURE: "🎭 Culture",
  NATURE: "🏞️ Nature",
  ENTERTAINMENT: "🎪 Divertissement",
  EDUCATION: "📚 Éducation",
  WELLNESS: "💆 Bien-être",
  FAMILY: "👨‍👩‍👧‍👦 Famille",
  ADVENTURE: "🧗 Aventure",
  MUSIC: "🎵 Musique",
  ART: "🎨 Art",
  FESTIVAL: "🎉 Festival",
  SHOPPING: "🛍️ Shopping",
  NIGHTLIFE: "🌙 Vie nocturne",
  OTHER: "📌 Autre",
};

export default function HomeScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await apiService.getActivities();
      setActivities(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch activities");
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  const filteredActivities =
    selectedCategories.length === 0
      ? activities
      : activities.filter((activity) =>
          activity.category?.some((cat) => selectedCategories.includes(cat)),
        );

  const validMarkers = filteredActivities.filter(
    (activity) =>
      activity.location.latitude !== null &&
      activity.location.longitude !== null,
  );

  const initialRegion = {
    latitude: 46.5197,
    longitude: 6.6323,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  const onActivityPress = (activity: ActivityResponse) => {
    setSelectedActivity(activity.id);

    // Switch to map view and focus on the location
    if (activity.location.latitude && activity.location.longitude) {
      setViewMode("map");

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
            350,
          );
        }
      }, 100);
    }
  };

  const renderActivityCard = ({ item }: { item: ActivityResponse }) => {
    const isSelected = selectedActivity === item.id;
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
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-3 text-base text-gray-600 font-medium">
          Chargement...
        </Text>
      </View>
    );
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
    );
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

      {/* Action Buttons */}
      <View className="absolute top-[120px] right-4 z-20 flex-col gap-2">
        <TouchableOpacity
          className="bg-white rounded-3xl px-4 py-3 flex-row items-center gap-2 shadow-lg"
          onPress={() => setViewMode(viewMode === "map" ? "list" : "map")}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-gray-800">
            {viewMode === "map" ? "📋 Liste" : "🗺️ Carte"}
          </Text>
          <View className="bg-blue-600 px-2 py-0.5 rounded-xl">
            <Text className="text-white text-xs font-bold">
              {filteredActivities.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-3xl px-4 py-3 flex-row items-center gap-2 shadow-lg"
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-gray-800">
            🔍 Filtres
          </Text>
          {selectedCategories.length > 0 && (
            <View className="bg-green-600 px-2 py-0.5 rounded-xl">
              <Text className="text-white text-xs font-bold">
                {selectedCategories.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filter Panel */}
      {showFilters && (
        <View className="absolute top-[230px] left-4 right-4 z-20 bg-white rounded-3xl shadow-2xl p-4 max-h-[400px]">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-900">Catégories</Text>
            {selectedCategories.length > 0 && (
              <TouchableOpacity onPress={clearFilters}>
                <Text className="text-sm text-red-500 font-semibold">
                  Effacer
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    className={`px-3 py-2 rounded-xl ${
                      isSelected
                        ? "bg-green-600 border-2 border-green-700"
                        : "bg-gray-100 border-2 border-gray-200"
                    }`}
                    onPress={() => toggleCategory(category)}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        isSelected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {CATEGORY_LABELS[category]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}

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
            {selectedCategories.length > 0 && (
              <Text className="text-sm text-gray-600 mt-1">
                {filteredActivities.length} résultat
                {filteredActivities.length > 1 ? "s" : ""} filtré
                {filteredActivities.length > 1 ? "s" : ""}
              </Text>
            )}
          </View>
          <FlatList
            data={filteredActivities}
            renderItem={renderActivityCard}
            keyExtractor={(item) => item.id}
            className="p-4 pb-8"
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}
