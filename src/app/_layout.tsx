import { useTheme } from "@/hooks/use-theme";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { LucideProvider } from "lucide-react-native";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <LucideProvider color={theme.text}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.accent },
            headerTintColor: theme.accentText,
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
