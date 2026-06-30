import { useTheme } from "@/hooks/use-theme";
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  updateExpense,
  type ExpenseInput,
} from "@/lib/database";
import { Checkbox } from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import CurrencyInput from "react-native-currency-input";

export default function DetailsScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    month?: string;
  }>();
  const expenseId = params.id ? Number(params.id) : undefined;
  const initialMonth = params.month as string | undefined;
  const data = expenseId ? getExpenseById(expenseId) : null;

  const theme = useTheme();
  const styles = useStyles(theme);

  const [description, setDescription] = useState(data?.description ?? "");
  const [price, setPrice] = useState<number | null>(data?.price ?? null);
  const [isRepeating, setIsRepeating] = useState(data?.isRepeating ?? false);
  const [isInInstallments, setIsInInstallments] = useState(
    data?.isInInstallments ?? false,
  );
  const [installmentCount, setInstallmentCount] = useState(
    data?.installmentCount ? String(data.installmentCount) : "12",
  );
  const [currentInstallment, setCurrentInstallment] = useState(
    data?.currentInstallment ? String(data.currentInstallment) : "1",
  );

  useEffect(() => {
    if (data) {
      setDescription(data.description);
      setPrice(data.price);
      setIsRepeating(data.isRepeating);
      setIsInInstallments(data.isInInstallments);
      setInstallmentCount(
        data.installmentCount ? String(data.installmentCount) : "",
      );
      setCurrentInstallment(
        data.currentInstallment ? String(data.currentInstallment) : "",
      );
    }
  }, [data?.id]);

  async function update() {
    if (!expenseId) {
      return;
    }

    const payload: ExpenseInput = {
      description: description.trim(),
      date:
        data?.date ?? initialMonth ?? new Date().toISOString().split("T")[0],
      price: price ?? 0,
      paid: data?.paid ?? false,
      isRepeating,
      isInInstallments,
      installmentCount: isInInstallments ? Number(installmentCount) || 1 : null,
      currentInstallment: isInInstallments
        ? Number(currentInstallment) || 1
        : null,
    };

    updateExpense(expenseId, payload);
    router.back();
  }

  async function create(isPaid: boolean) {
    if (!description.trim() || price === null) {
      return;
    }

    const payload: ExpenseInput = {
      description: description.trim(),
      date: initialMonth ?? new Date().toISOString().split("T")[0],
      price,
      paid: isPaid,
      isRepeating,
      isInInstallments,
      installmentCount: isInInstallments ? Number(installmentCount) || 1 : null,
      currentInstallment: isInInstallments
        ? Number(currentInstallment) || 1
        : null,
    };

    createExpense(payload);
    router.back();
  }

  async function togglePaid(isPaid: boolean) {
    if (!expenseId) {
      return;
    }

    updateExpense(expenseId, { paid: isPaid });
    router.back();
  }

  async function erase() {
    if (expenseId) {
      deleteExpense(expenseId);
    }

    router.back();
  }

  return (
    <View style={styles.Main}>
      <View style={styles.Form}>
        <View>
          <Text style={styles.Text}>Descrição</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
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
                onValueChange={(value) => {
                  setIsInInstallments(value);
                  if (!value) {
                    setInstallmentCount("");
                    setCurrentInstallment("");
                  }
                }}
              />
              <Text style={styles.Text}>Parcelado</Text>
            </View>

            {isInInstallments && (
              <>
                <View>
                  <Text style={styles.Text}>Número de parcelas</Text>
                  <TextInput
                    value={installmentCount}
                    onChangeText={setInstallmentCount}
                    style={styles.Input}
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="number-pad"
                    placeholder="12"
                  />
                </View>

                <View>
                  <Text style={styles.Text}>Parcela atual</Text>
                  <TextInput
                    value={currentInstallment}
                    onChangeText={setCurrentInstallment}
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
      </View>

      <View style={styles.Buttons}>
        <Pressable
          style={({ pressed }) => [
            styles.Button,
            styles.AddButton,
            pressed && styles.ButtonPressed,
          ]}
          onPress={() => (expenseId ? update() : create(false))}
        >
          <Text style={[styles.ButtonText, { textAlign: "center" }]}>
            {expenseId ? "ATUALIZAR" : "ADICIONAR"}
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.Button,
            data?.paid ? styles.NotPaidButton : styles.PaidButton,
            pressed && styles.ButtonPressed,
          ]}
          onPress={() => (expenseId ? togglePaid(!data?.paid) : create(true))}
        >
          <Text style={[styles.ButtonText, { textAlign: "center" }]}>
            {data?.paid ? "NÃO PAGO" : "PAGO"}
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.Button,
            styles.EraseButton,
            pressed && styles.ButtonPressed,
          ]}
          onPress={() => (expenseId ? erase() : router.back())}
        >
          <Text style={[styles.ButtonText, { textAlign: "center" }]}>
            APAGAR
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const useStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    Main: {
      display: "flex",
      justifyContent: "space-between",
      height: "100%",
    },
    Form: {
      padding: 24,
      display: "flex",
      gap: 24,
    },
    Buttons: {
      display: "flex",
      gap: 12,
      padding: 24,
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
    NotPaidButton: {
      backgroundColor: "#ffab4a",
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
