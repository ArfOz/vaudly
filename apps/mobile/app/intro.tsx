<<<<<<< HEAD
import { useState } from "react"
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native"
import { useRouter } from "expo-router"
=======
import { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { useRouter } from "expo-router";
>>>>>>> 6b81f19dca48f7a7180f1f041801c490fa07e5ce
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
<<<<<<< HEAD
} from "react-native-reanimated"

const { width, height } = Dimensions.get("window")
=======
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
>>>>>>> 6b81f19dca48f7a7180f1f041801c490fa07e5ce

const INTRO_SLIDES = [
  {
    id: 1,
    title: "Discover Local Activities",
    description:
      "Explore authentic farm experiences and local activities in your area",
    emoji: "🌾",
  },
  {
    id: 2,
    title: "Interactive Map",
    description: "Find activities near you with our interactive map view",
    emoji: "🗺️",
  },
  {
    id: 3,
    title: "Direct Sales",
    description: "Connect directly with local farmers and producers",
    emoji: "🚜",
  },
<<<<<<< HEAD
]

export default function IntroScreen() {
  import { useState } from "react";
  import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
  import { useRouter } from "expo-router";
  import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
  } from "react-native-reanimated";

  const { width, height } = Dimensions.get("window");

  const INTRO_SLIDES = [
    {
      id: 1,
      title: "Discover Local Activities",
      description:
        "Explore authentic farm experiences and local activities in your area",
      emoji: "🌾",
    },
    {
      id: 2,
      title: "Interactive Map",
      description: "Find activities near you with our interactive map view",
      emoji: "🗺️",
    },
    {
      id: 3,
      title: "Direct Sales",
      description: "Connect directly with local farmers and producers",
      emoji: "🚜",
    },
  ];

  export default function IntroScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: translateX.value }],
        opacity: opacity.value,
      };
    });

    const handleNext = () => {
      if (currentIndex < INTRO_SLIDES.length - 1) {
        opacity.value = withTiming(0, { duration: 200 }, () => {
          translateX.value = withSpring(0);
          opacity.value = withTiming(1, { duration: 300 });
        });
        setCurrentIndex(currentIndex + 1);
      } else {
        handleGetStarted();
      }
    };

    const handleSkip = () => {
      handleGetStarted();
    };

    const handleGetStarted = () => {
      router.replace("/home");
    };

    const currentSlide = INTRO_SLIDES[currentIndex];

    return (
      <View className="flex-1 bg-green-50">
        {/* Skip Button */}
        {currentIndex < INTRO_SLIDES.length - 1 && (
          <TouchableOpacity
            onPress={handleSkip}
            className="absolute top-12 right-6 z-10 px-4 py-2"
          >
            <Text className="text-gray-600 font-semibold">Skip</Text>
          </TouchableOpacity>
        )}

        {/* Content */}
        <View className="flex-1 justify-center items-center px-8">
          <Animated.View style={animatedStyle} className="items-center">
            {/* Emoji Icon */}
            <View className="w-40 h-40 bg-white rounded-full items-center justify-center shadow-lg mb-12">
              <Text className="text-8xl">{currentSlide.emoji}</Text>
            </View>

            {/* Title */}
            <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
              {currentSlide.title}
            </Text>

            {/* Description */}
            <Text className="text-lg text-gray-600 text-center leading-relaxed">
              {currentSlide.description}
            </Text>
          </Animated.View>
        </View>

        {/* Bottom Section */}
        <View className="px-8 pb-12">
          {/* Pagination Dots */}
          <View className="flex-row justify-center items-center mb-8">
            {INTRO_SLIDES.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full mx-1 ${
                  index === currentIndex ? "w-8 bg-green-600" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </View>

          {/* Next/Get Started Button */}
          <TouchableOpacity
            onPress={handleNext}
            className="bg-green-600 rounded-2xl py-4 shadow-lg mb-3"
          >
            <Text className="text-white text-center text-lg font-bold">
              {currentIndex === INTRO_SLIDES.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>

          {/* Contact Button */}
          <TouchableOpacity
            onPress={() => router.push("/contact")}
            className="border-2 border-green-600 rounded-2xl py-4"
          >
            <Text className="text-green-600 text-center text-lg font-bold">
              Contact Us
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
          </Text>
