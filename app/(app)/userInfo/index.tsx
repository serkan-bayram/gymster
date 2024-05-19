import { Input } from "@/components/input";
import { PrimaryButton } from "@/components/primary-button";
import {
  validateAge,
  validateGender,
  validateWeight,
} from "@/utils/validations";
import { Picker } from "@react-native-picker/picker";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  Text,
  View,
} from "react-native";
import { updateUserInfo } from "@/utils/db";
import { useSession } from "@/utils/session-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserInfo() {
  const [age, setAge] = useState<string | undefined>();
  const [weight, setWeight] = useState<string | undefined>();
  const [gender, setGender] = useState<string | undefined>();

  const pickerRef = useRef<any>(null);

  const { session } = useSession();
  const router = useRouter();

  const handlePress = async () => {
    // This object will be saved to DB
    let saveObject = {};

    if (!!age && age.length > 0) {
      const result = validateAge(age);

      if (!result) {
        return;
      }

      saveObject = { ...saveObject, age: age };
    }

    if (!!weight && weight.length > 0) {
      const result = validateWeight(weight);

      if (!result) {
        return;
      }

      saveObject = { ...saveObject, weight: weight };
    }

    if (!!gender && gender.length > 0) {
      const result = validateGender(gender);

      if (!result) {
        return;
      }

      if (gender.length > 0) {
        saveObject = { ...saveObject, gender: gender };
      }
    }

    if (session && Object.keys(saveObject).length > 0) {
      await updateUserInfo(saveObject, session.uid);
      handleSkip();
      router.replace("/home");
    } else {
      Alert.alert("Hata", "Herhangi bir bilgi girmediniz.");
    }
  };

  // This screen will be only shown at first sign in
  // TODO: Skipped true is not enough
  // We need to check which account for is skipped
  const handleSkip = async () => {
    // Save to local storage
    const jsonSkipped = JSON.stringify({ skipped: true });

    await AsyncStorage.setItem("skipped", jsonSkipped);
  };

  return (
    <View className="flex-1 bg-[#B0EBB4]">
      <KeyboardAvoidingView
        behavior="padding"
        className=" flex px-6 gap-y-4 pt-36 items-center  h-screen"
      >
        <Link
          replace
          href={"/home"}
          className="absolute top-16 right-3 font-semibold 
      p-1 px-3"
          asChild
        >
          <Pressable onPress={handleSkip}>
            <Text>Atla</Text>
          </Pressable>
        </Link>
        <Text className="font-bold w-full text-3xl">
          Bize biraz kendinden bahset. ✨
        </Text>
        <Input
          className="w-full"
          placeholder="Yaşın"
          keyboardType="numeric"
          onChangeText={setAge}
        />

        <Input
          className="w-full"
          placeholder="Mevcut Kilon"
          keyboardType="numeric"
          onChangeText={setWeight}
        />

        <Pressable
          className="w-full"
          onPress={() => {
            if (pickerRef.current) {
              pickerRef.current.focus();
            }
          }}
        >
          <Input
            value={gender}
            placeholder="Cinsiyetin"
            className="w-full text-black"
            editable={false}
          />
        </Pressable>

        <PrimaryButton
          onPress={handlePress}
          text="Devam Et"
          className="w-2/3"
        />

        <Text className="text-xs absolute bottom-4 text-center">
          * Bu bilgiler gelişiminizi takip etmeniz ve kalori ölçümlerinizin
          doğru olması açısından çok önemlidir.
        </Text>

        <View className="hidden">
          <Picker
            ref={pickerRef}
            selectedValue={gender}
            onValueChange={(pickedValue) =>
              pickedValue === "none" ? setGender("") : setGender(pickedValue)
            }
          >
            <Picker.Item label="İptal" value="none" />
            <Picker.Item label="Kadın" value="Kadın" />
            <Picker.Item label="Erkek" value="Erkek" />
          </Picker>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
