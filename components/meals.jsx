import { FlashList } from "@shopify/flash-list";
import { cn } from "@/utils/cn";
import { Text, View } from "react-native";
import { AddMeal } from "./ui/add-meal";

export function Meals() {
  // This will come from DB
  const meals = [
    {
      index: "#0",
      summary: "Eggs, Rice, Yoghurt",
      calories: [
        { type: "Kcal", value: "342" },
        { type: "Protein", value: "13" },
        { type: "Fat", value: "27" },
        { type: "Carbs", value: "120" },
      ],
    },
    {
      index: "#1",
      summary: "Eggs, Rice, Yoghurt",
      calories: [
        { type: "Kcal", value: "342" },
        { type: "Protein", value: "13" },
        { type: "Fat", value: "27" },
        { type: "Carbs", value: "120" },
      ],
    },
    {
      index: "#2",
      summary: "Meat",
      calories: [
        { type: "Kcal", value: "300" },
        { type: "Protein", value: "10" },
        { type: "Fat", value: "20" },
        { type: "Carbs", value: "200" },
      ],
    },
    {
      index: "#3",
      summary: "Meat",
      calories: [
        { type: "Kcal", value: "300" },
        { type: "Protein", value: "10" },
        { type: "Fat", value: "20" },
        { type: "Carbs", value: "200" },
      ],
    },
    {
      index: "#4",
      summary: "Meat",
      calories: [
        { type: "Kcal", value: "300" },
        { type: "Protein", value: "10" },
        { type: "Fat", value: "20" },
        { type: "Carbs", value: "200" },
      ],
    },
    {
      index: "#5",
      summary: "Meat",
      calories: [
        { type: "Kcal", value: "300" },
        { type: "Protein", value: "10" },
        { type: "Fat", value: "20" },
        { type: "Carbs", value: "200" },
      ],
    },
  ];

  // We can specify the colors of meal background & texts
  // It's important to write full tailwind styles to make it work
  // TODO: make a better color palatte
  const colorPalattes = [
    { textColor: "text-white", color: "bg-[#453F78]" },
    { textColor: "text-white", color: "bg-[#FA7070]" },
    { textColor: "text-white", color: "bg-[#C08B5C]" },
    { textColor: "text-black", color: "bg-[#FBF3D5]" },
  ];

  const getColor = (index) => {
    // Default colors if something wents wrong while
    // choosing color palatte
    let bgColor = "bg-black";
    let textColor = "text-white";

    // Choosing the right color palatte according to
    // index of meal
    colorPalattes.forEach((palatte, palatteIndex) => {
      if (index > colorPalattes.length - 1) {
        index = index % 4;
      }

      if (palatteIndex === index) {
        bgColor = palatte.color;
        textColor = palatte.textColor;
      }
    });

    return { bgColor, textColor };
  };

  return (
    <View className="flex px-4 mt-2">
      <Text className="text-lg mb-2">What did you eat today?</Text>
      <View className="h-30 ">
        <FlashList
          horizontal={true}
          data={meals}
          estimatedItemSize={253}
          renderItem={({ item, index }) => {
            if (index === 0) {
              return <AddMeal />;
            }

            const { bgColor, textColor } = getColor(index);

            return (
              <View
                className={cn(
                  `mr-4 border-2  border-secondary self-start rounded-2xl p-3`,
                  bgColor
                )}
              >
                <Text className={cn(`text-lg`, textColor)}>
                  <Text className="font-bold">{item.index}</Text> {item.summary}
                </Text>

                <View className="mt-3 flex flex-row gap-x-4">
                  {item.calories.map((calorie, index) => (
                    <View key={index}>
                      <Text className={cn("text-center text-lg", textColor)}>
                        {calorie.value}
                      </Text>
                      <Text className={cn("text-center", textColor)}>
                        {calorie.type}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
