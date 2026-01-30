import "../global.css"
import { StatusBar } from "expo-status-bar"
import "react-native-reanimated"
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
// @ts-ignore - expo-router provides Stack at runtime but its d.ts is not recognized as a module here
import { Stack } from "expo-router"

// Update the import path to a relative path if the hook exists locally
import { useColorScheme } from "../hooks/use-color-scheme"

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="intro" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="contact" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
