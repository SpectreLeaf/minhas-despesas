import { router } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";

export default function HomeScreen() {
  return null; // TODO
}

export function HeaderRight() {
  return (
    <>
      <Pressable
        onPress={() => router.navigate("/details")}
        style={({ pressed }) => [styles.Plus, pressed && styles.PlusPressed]}
      >
        <PlusIcon />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  Plus: {},
  PlusPressed: {},
});
