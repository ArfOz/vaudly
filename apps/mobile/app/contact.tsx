import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";

export default function ContactScreen() {
  const router = useRouter();

  const handleEmail = () => {
    Linking.openURL("mailto:contact@vaudly.ch");
  };

  const handlePhone = () => {
    Linking.openURL("tel:+41123456789");
  };

  const handleWebsite = () => {
    Linking.openURL("https://vaudly.ch");
  };

  const handleSocial = (platform: string) => {
    const urls: { [key: string]: string } = {
      instagram: "https://instagram.com/vaudly",
      facebook: "https://facebook.com/vaudly",
      twitter: "https://twitter.com/vaudly",
    };
    Linking.openURL(urls[platform]);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Navigation Bar */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-3 px-4">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            className="flex-1 bg-gray-100 py-3 rounded-xl mr-2 items-center"
            onPress={() => router.push("/home")}
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 text-base font-bold">🏠 Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-green-600 py-3 rounded-xl ml-2 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-bold">📧 Contact</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Header */}
      <View className="bg-green-600 pt-8 pb-8 px-6">
        <Text className="text-3xl font-bold text-white mb-2">Contact Us</Text>
        <Text className="text-green-100 text-base">
          We'd love to hear from you
        </Text>
      </View>

      {/* Content */}
      <View className="px-6 py-8">
        {/* Email */}
        <TouchableOpacity
          onPress={handleEmail}
          className="bg-white rounded-2xl p-5 mb-4 border border-gray-200 shadow-sm"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">✉️</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 mb-1">
                Email
              </Text>
              <Text className="text-sm text-gray-600">Send us an email</Text>
            </View>
          </View>
          <Text className="text-blue-600 font-semibold">contact@vaudly.ch</Text>
        </TouchableOpacity>

        {/* Phone */}
        <TouchableOpacity
          onPress={handlePhone}
          className="bg-white rounded-2xl p-5 mb-4 border border-gray-200 shadow-sm"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">📞</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 mb-1">
                Phone
              </Text>
              <Text className="text-sm text-gray-600">Give us a call</Text>
            </View>
          </View>
          <Text className="text-green-600 font-semibold">+41 12 345 67 89</Text>
        </TouchableOpacity>

        {/* Website */}
        <TouchableOpacity
          onPress={handleWebsite}
          className="bg-white rounded-2xl p-5 mb-4 border border-gray-200 shadow-sm"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">🌐</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 mb-1">
                Website
              </Text>
              <Text className="text-sm text-gray-600">Visit our website</Text>
            </View>
          </View>
          <Text className="text-purple-600 font-semibold">www.vaudly.ch</Text>
        </TouchableOpacity>

        {/* Social Media */}
        <View className="mt-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Follow Us
          </Text>
          <View className="flex-row justify-around">
            <TouchableOpacity
              onPress={() => handleSocial("instagram")}
              className="items-center"
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 bg-pink-100 rounded-2xl items-center justify-center mb-2">
                <Text className="text-3xl">📷</Text>
              </View>
              <Text className="text-sm text-gray-700 font-medium">
                Instagram
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSocial("facebook")}
              className="items-center"
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 bg-blue-100 rounded-2xl items-center justify-center mb-2">
                <Text className="text-3xl">📘</Text>
              </View>
              <Text className="text-sm text-gray-700 font-medium">
                Facebook
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSocial("twitter")}
              className="items-center"
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 bg-sky-100 rounded-2xl items-center justify-center mb-2">
                <Text className="text-3xl">🐦</Text>
              </View>
              <Text className="text-sm text-gray-700 font-medium">Twitter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Address */}
        <View className="mt-8 bg-gray-50 rounded-2xl p-5">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            📍 Our Location
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            Vaudly Switzerland{"\n"}
            Rue de Lausanne 123{"\n"}
            1000 Lausanne{"\n"}
            Switzerland
          </Text>
        </View>

        {/* Info */}
        <View className="mt-6 bg-green-50 rounded-2xl p-5">
          <Text className="text-base text-green-900 leading-6">
            💚 We're here to help! Feel free to reach out with any questions
            about activities, farm visits, or local experiences in Vaud.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
