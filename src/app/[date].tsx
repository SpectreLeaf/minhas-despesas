import { useTheme } from "@/hooks/use-theme";
import { getExpensesForMonth, type ExpenseOccurrence } from "@/lib/database";
import { brlFormatter, monthAsPortugueseName, toDateString } from "@/lib/utils";
import {
  Link,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { date } = useLocalSearchParams();

  const currentDate = new Date(date as string);
  const [expenses, setExpenses] = useState<ExpenseOccurrence[]>([]);

  useFocusEffect(
    useCallback(() => {
      setExpenses(getExpensesForMonth(currentDate));
    }, [currentDate]),
  );

  function back() {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    router.replace({
      pathname: "/[date]",
      params: { date: toDateString(newDate) },
    });
  }

  function forward() {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    router.replace({
      pathname: "/[date]",
      params: { date: toDateString(newDate) },
    });
  }

  return (
    <View style={mainStyles.Main}>
      <View style={mainStyles.DatePicker}>
        <Pressable onPress={back}>
          <ChevronLeftIcon color="#000000" />
        </Pressable>
        <Text style={{ color: "#000000", fontWeight: "bold", fontSize: 20 }}>
          {monthAsPortugueseName(currentDate.getMonth())} /{" "}
          {currentDate.getFullYear()}
        </Text>
        <View style={mainStyles.Actions}>
          <Link
            href={{
              pathname: "/details",
              params: { month: toDateString(currentDate) },
            }}
          >
            <PlusIcon color="#000000" />
          </Link>
          <Pressable onPress={forward}>
            <ChevronRightIcon color="#000000" />
          </Pressable>
        </View>
      </View>

      <ScrollView style={mainStyles.Container}>
        {expenses.length === 0 ? (
          <Text style={mainStyles.EmptyState}>
            Nenhuma despesa para este mês ainda.
          </Text>
        ) : (
          expenses.map((card) => (
            <Link
              href={{
                pathname: "/details",
                params: { id: card.id, month: toDateString(currentDate) },
              }}
              key={card.id}
            >
              <Card {...card} />
            </Link>
          ))
        )}
      </ScrollView>

      <View style={mainStyles.Total}>
        <View style={mainStyles.TotalTextContainer}>
          <Text style={mainStyles.TotalText}>Total: </Text>
          <Text style={mainStyles.TotalBoldText}>
            {brlFormatter.format(
              expenses.reduce((acc, expense) => (acc += expense.price), 0),
            )}
          </Text>
        </View>

        <View style={mainStyles.TotalTextContainer}>
          <Text style={mainStyles.TotalText}>A pagar: </Text>
          <Text style={mainStyles.TotalBoldText}>
            {brlFormatter.format(
              expenses.reduce(
                (acc, expense) => (acc += expense.paid ? 0 : expense.price),
                0,
              ),
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}

function Card({
  description,
  date,
  price,
  paid,
  isInInstallments,
  installmentCount,
  currentInstallment,
}: ExpenseOccurrence) {
  const theme = useTheme();
  const styles = useCardStyles(theme);

  return (
    <View style={[styles.Card, paid && styles.PaidCard]}>
      <View>
        <Text style={styles.CardBold}>{description}</Text>
        <Text style={styles.CardDate}>
          {new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR")}
          {isInInstallments && (
            <>
              {" "}
              &bull; {currentInstallment} / {installmentCount}
            </>
          )}
        </Text>
      </View>
      <View>
        <Text style={styles.CardBold}>{brlFormatter.format(price)}</Text>
      </View>
    </View>
  );
}

const mainStyles = StyleSheet.create({
  Main: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
  },
  Total: {
    padding: 24,
    backgroundColor: "#50b0ff",
  },
  TotalTextContainer: {
    display: "flex",
    flexDirection: "row",
  },
  TotalText: {
    color: "#000000",
  },
  TotalBoldText: {
    color: "#000000",
    fontWeight: "bold",
  },

  DatePicker: {
    backgroundColor: "#50b0ff",
    padding: 12,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  Actions: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  Container: {
    display: "flex",
    flex: 1,
    overflowY: "scroll",
  },
  EmptyState: {
    padding: 24,
    color: "#666666",
    textAlign: "center",
  },
});

const useCardStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    Card: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomColor: theme.backgroundElement,
      borderBottomWidth: 1,
      padding: 12,
      width: "100%",
    },
    PaidCard: {
      backgroundColor: "#3fff7280",
    },
    CardText: {
      color: theme.text,
    },
    CardBold: {
      color: theme.text,
      fontWeight: "bold",
      fontSize: 20,
    },
    CardDate: {
      color: theme.textSecondary,
    },
  });
