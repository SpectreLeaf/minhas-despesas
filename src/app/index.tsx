import { useTheme } from "@/hooks/use-theme";
import { mockData, type CardData } from "@/lib/mock-data";
import { brlFormatter, monthAsPortugueseName } from "@/lib/utils";
import { Link } from "expo-router";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const theme = useTheme();

  function back() {
    setCurrentDate((p) => {
      const newDate = new Date(p);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }

  function forward() {
    setCurrentDate((p) => {
      const newDate = new Date(p);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }

  return (
    <View>
      <View style={mainStyles.DatePicker}>
        <Pressable onPress={back}>
          <ChevronLeftIcon color="#000000" />
        </Pressable>
        <Text style={{ color: "#000000", fontWeight: "bold", fontSize: 20 }}>
          {monthAsPortugueseName(currentDate.getMonth())} /{" "}
          {currentDate.getFullYear()}
        </Text>
        <Pressable onPress={forward}>
          <ChevronRightIcon color="#000000" />
        </Pressable>
      </View>

      <View style={mainStyles.Container}>
        {mockData.map((card) => (
          <Link
            href={{
              pathname: "/details",
              params: { id: card.id },
            }}
            key={card.id}
          >
            <Card {...card} />
          </Link>
        ))}
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
}: CardData) {
  const theme = useTheme();
  const styles = useCardStyles(theme);

  return (
    <View style={[styles.Card, paid && styles.PaidCard]}>
      <View>
        <Text style={styles.CardBold}>{description}</Text>
        <Text style={styles.CardDate}>
          {date.toLocaleDateString("pt-BR")}
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
  DatePicker: {
    backgroundColor: "#50b0ff",
    padding: 12,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  Container: {
    display: "flex",
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
