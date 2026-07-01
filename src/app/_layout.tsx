import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { LucideProvider } from "lucide-react-native";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <LucideProvider color={colorScheme === "dark" ? "#FFFFFF" : "#000000"}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#50b0ff" },
            headerTintColor: "#000",
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="[date]"
            options={{ title: "Despesas pessoais" }}
          />
          <Stack.Screen name="details" options={{ title: "Detalhamento" }} />
        </Stack>
      </LucideProvider>
    </ThemeProvider>
  );
}
