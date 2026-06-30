import { useTheme } from "@/hooks/use-theme";
import { Checkbox } from "expo-checkbox";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import CurrencyInput from "react-native-currency-input";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [price, setPrice] = useState<number | null>(null);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isInInstallments, setIsInInstallments] = useState(false);
  const descriptionRef = useRef<TextInput>(null);
  const installmentCountRef = useRef<TextInput>(null);
  const currentInstallmentRef = useRef<TextInput>(null);

  return (
    <View style={styles.Main}>
      <View>
        <Text style={styles.Text}>Descrição</Text>
        <TextInput
          ref={descriptionRef}
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

      <View style={styles.CheckboxContainer}>
        <Checkbox value={isRepeating} onValueChange={setIsRepeating} />
        <Text style={styles.Text}>Repetido</Text>
      </View>

      {isRepeating && (
        <>
          <View style={styles.CheckboxContainer}>
            <Checkbox
              value={isInInstallments}
              onValueChange={setIsInInstallments}
            />
            <Text style={styles.Text}>Parcelado</Text>
          </View>

          {isInInstallments && (
            <>
              <View>
                <Text style={styles.Text}>Número de parcelas</Text>
                <TextInput
                  ref={installmentCountRef}
                  style={styles.Input}
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                  placeholder="12"
                />
              </View>

              <View>
                <Text style={styles.Text}>Parcela atual</Text>
                <TextInput
                  ref={currentInstallmentRef}
                  style={styles.Input}
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                  placeholder="1"
                />
              </View>
            </>
          )}
        </>
      )}

      <View style={styles.Buttons}>
        <Pressable
          style={({ pressed }) => [
            styles.Button,
            styles.AddButton,
            pressed && styles.ButtonPressed,
          ]}
        >
          <Text style={[styles.ButtonText, { textAlign: "center" }]}>
            {id ? "ATUALIZAR" : "ADICIONAR"}
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
      display: "flex",
      gap: 12,
    },
    CheckboxContainer: {
      display: "flex",
      flexDirection: "row",
      gap: 4,
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
