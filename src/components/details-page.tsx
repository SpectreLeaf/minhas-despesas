import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import CurrencyInput from "react-native-currency-input";

export function DetailsPage({ type = "detail" }: { type?: "add" | "detail" }) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [price, setPrice] = useState<number | null>(null);

  return (
    <View style={styles.Main}>
      <View>
        <Text style={styles.Text}>Descrição</Text>
        <TextInput
          style={styles.Input}
          placeholderTextColor={theme.textSecondary}
          placeholder="Compras do mês"
        />
      </View>

      <View>
        <Text style={styles.Text}>Preço</Text>
        <CurrencyInput
          value={price}
          onChangeValue={setPrice}
          style={styles.Input}
          placeholderTextColor={theme.textSecondary}
          placeholder="500,00"
        />
      </View>

      <View style={styles.Buttons}>
        <Pressable
          style={({ pressed }) => [
            styles.Button,
            styles.AddButton,
            pressed && styles.ButtonPressed,
          ]}
        >
          <Text style={[styles.ButtonText, { textAlign: "center" }]}>
            ADICIONAR
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.Button,
            styles.PaidButton,
            pressed && styles.ButtonPressed,
          ]}
        >
          <Text style={[styles.ButtonText, { textAlign: "center" }]}>PAGO</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.Button,
            styles.EraseButton,
            pressed && styles.ButtonPressed,
          ]}
        >
          <Text style={[styles.ButtonText, { textAlign: "center" }]}>
            APAGAR
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    Main: {
      padding: 24,
      display: "flex",
      gap: 24,
    },
    Buttons: {
      marginTop: "auto",
      display: "flex",
      gap: 12,
    },

    Text: {
      color: theme.text,
    },
    Input: {
      borderBottomColor: theme.text,
      borderBottomWidth: 1,
      color: theme.text,
    },

    Button: {
      padding: 12,
    },
    AddButton: {
      backgroundColor: "#50b0ff",
    },
    PaidButton: {
      backgroundColor: "#61B100",
    },
    EraseButton: {
      backgroundColor: "#FF504A",
    },
    ButtonPressed: {
      transform: [{ translateY: 2 }],
    },
    ButtonText: {
      color: "#000000",
    },
  });
