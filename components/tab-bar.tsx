import { View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, usePathname } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export function TabBar() {
  const pathname = usePathname();

  // There will be no TabBar in these paths
  const hiddenPaths = ["/user-info", "/"];

  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  const activeColor = "#fff";
  const inactiveColor = "#414d5e";

  const hitSlop = { top: 50, bottom: 50, left: 30, right: 30 };
  const activeOpacity = 0.5;

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
        <Link asChild href={"/home"}>
          <TouchableOpacity activeOpacity={activeOpacity} hitSlop={hitSlop}>
            <Entypo
              name="home"
              size={30}
              color={pathname === "/home" ? activeColor : inactiveColor}
            />
          </TouchableOpacity>
        </Link>
        <Link asChild href={"/running"}>
          <TouchableOpacity activeOpacity={activeOpacity} hitSlop={hitSlop}>
            <FontAwesome6
              name="person-running"
              size={30}
              color={pathname === "/running" ? activeColor : inactiveColor}
            />
          </TouchableOpacity>
        </Link>
        <Link asChild href={"/tracking"}>
          <TouchableOpacity activeOpacity={activeOpacity} hitSlop={hitSlop}>
            <MaterialIcons
              name="auto-graph"
              size={30}
              color={pathname === "/tracking" ? activeColor : inactiveColor}
            />
          </TouchableOpacity>
        </Link>
        <Link asChild href={"/profile"}>
          <TouchableOpacity activeOpacity={activeOpacity} hitSlop={hitSlop}>
            <FontAwesome
              name="user-circle-o"
              size={30}
              color={pathname === "/profile" ? activeColor : inactiveColor}
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
