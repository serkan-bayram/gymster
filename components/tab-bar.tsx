import { Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, usePathname } from "expo-router";
import { cn } from "@/utils/cn";

function Route({
  children,
  href,
  name,
}: {
  children: React.ReactNode;
  href: string;
  name: string;
}) {
  const pathname = usePathname();

  return (
    <Link href={href}>
      <View className={cn("flex gap-y-1 items-center ")}>
        {children}
        <Text
          className={cn("text-xs font-bold text-secondary", {
            "text-primary": pathname === href,
          })}
        >
          {name}
        </Text>
      </View>
    </Link>
  );
}

export function TabBar() {
  const pathname = usePathname();

  return (
    <View
      className="absolute  bottom-0 left-0
    w-full p-1 h-16 flex-row justify-evenly bg-background border  border-black/30
     border-x-0 border-b-0"
    >
      <Route href="/tracking" name="Tracking">
        <Entypo
          name="circular-graph"
          size={24}
          color={pathname === "/tracking" ? "#EA8140" : "#1B1B1B"}
        />
      </Route>
      <Route href="/profile" name="Profile">
        <FontAwesome
          name="user-circle-o"
          size={24}
          color={pathname === "/profile" ? "#EA8140" : "#1B1B1B"}
        />
      </Route>
    </View>
  );
}
