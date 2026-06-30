import {
  DarkTheme,
  DefaultTheme,
  Link,
  Stack,
  ThemeProvider,
} from "expo-router";
import { LucideProvider, PlusIcon } from "lucide-react-native";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <LucideProvider color={colorScheme === "dark" ? "#FFFFFF" : "#000000"}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Despesas pessoais",
              headerRight: () => (
                <>
                  <Link href="/details">
                    <PlusIcon />
                  </Link>
                </>
              ),
            }}
          />
          <Stack.Screen name="details" options={{ title: "Detalhamento" }} />
        </Stack>
      </LucideProvider>
    </ThemeProvider>
  );
}
