import { toDateString } from "@/lib/utils";
import { Redirect } from "expo-router";

export default function IndexScreen() {
  return (
    <Redirect
      href={{
        pathname: "/[date]",
        params: { date: toDateString(new Date()) },
      }}
    />
  );
}
