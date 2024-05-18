import { View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, usePathname } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export function TabBar() {
  const pathname = usePathname();

  // There will be no TabBar in these paths
  const hiddenPaths = ["/userInfo"];

  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  const activeColor = "#fff";
  const inactiveColor = "#414d5e";

  return (
    <View
      className="absolute bottom-0 left-0
    w-full  h-[80px] 
     "
    >
      <View
        className="flex mx-4 justify-evenly  p-4 px-0 rounded-full 
      flex-row items-center bg-black"
      >
        <Link href={"/home"}>
          <Entypo
            name="home"
            size={30}
            color={pathname === "/home" ? activeColor : inactiveColor}
          />
        </Link>
        <Link href={"/tracking"}>
          <MaterialIcons
            name="auto-graph"
            size={30}
            color={pathname === "/tracking" ? activeColor : inactiveColor}
          />
        </Link>
        <Link href={"/profile"}>
          <FontAwesome
            name="user-circle-o"
            size={30}
            color={pathname === "/profile" ? activeColor : inactiveColor}
          />
        </Link>
      </View>
    </View>
  );
}
