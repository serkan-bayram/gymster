import { Picker as RNPicker } from "@react-native-picker/picker";
import { Dispatch, SetStateAction } from "react";
import { View } from "react-native";

export function MonthPicker({
  pickerRef,
  selectedValue,
  setValue,
}: {
  pickerRef: any;
  selectedValue: string;
  setValue: Dispatch<SetStateAction<string>>;
}) {
  return (
    <View className="hidden">
      <RNPicker
        ref={pickerRef}
        selectedValue={selectedValue}
        onValueChange={(pickedValue) =>
          pickedValue === "none"
            ? setValue(selectedValue)
            : setValue(pickedValue)
        }
      >
        <RNPicker.Item label="İptal" value="none" />
        <RNPicker.Item label="Ocak" value="Ocak" />
        <RNPicker.Item label="Şubat" value="Şubat" />
        <RNPicker.Item label="Mart" value="Mart" />
        <RNPicker.Item label="Nisan" value="Nisan" />
        <RNPicker.Item label="Mayıs" value="Mayıs" />
        <RNPicker.Item label="Haziran" value="Haziran" />
        <RNPicker.Item label="Temmuz" value="Temmuz" />
        <RNPicker.Item label="Ağustos" value="Ağustos" />
        <RNPicker.Item label="Eylül" value="Eylül" />
        <RNPicker.Item label="Ekim" value="Ekim" />
        <RNPicker.Item label="Kasım" value="Kasım" />
        <RNPicker.Item label="Aralık" value="Aralık" />
      </RNPicker>
    </View>
  );
}
