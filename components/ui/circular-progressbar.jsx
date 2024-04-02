import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const BACKGROUND_COLOR = "#444B6F";
const BACKGROUND_STROKE_COLOR = "#303858";
const STROKE_COLOR = "#A6E1FA";

const { width, height } = Dimensions.get("window");

const CIRCLE_LENGTH = 400;
const R = CIRCLE_LENGTH / (2 * Math.PI);

export function ProgressBar() {
  return (
    <View className="flex-1 items-center justify-center">
      <Svg>
        <Circle cx="50%" cy="50%" r={R} stroke={"red"} strokeWidth={10} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    fontSize: 80,
    color: "rgba(256,256,256,0.7)",
    width: 200,
    textAlign: "center",
  },
  button: {
    position: "absolute",
    bottom: 80,
    width: width * 0.7,
    height: 60,
    backgroundColor: BACKGROUND_STROKE_COLOR,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 25,
    color: "white",
    letterSpacing: 2.0,
  },
});
