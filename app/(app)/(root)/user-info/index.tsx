import { Input } from "@/components/input";
import { PrimaryButton } from "@/components/primary-button";
import {
  validateAge,
  validateGender,
  validateWeight,
} from "@/utils/validations";
import { Picker } from "@react-native-picker/picker";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import { updateUserInfo } from "@/utils/db/user-info";
import { TouchableOpacity } from "react-native-gesture-handler";
import { setIsSignIn } from "@/utils/state/session/sessionSlice";

export interface UserInfo {
  age?: number;
  weight?: number;
  gender?: string;
}

export default function UserInfo() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [info, setInfo] = useState<UserInfo | null>(null);
  const pickerRef = useRef<any>(null);

  const { user } = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setIsSignIn(false));
  }, []);

  const validate = useValidate({ info: info });

  const handlePress = async () => {
    if (!user) return null;

    const saveObject = validate();

    if (!saveObject) return null;

    await updateUserInfo({ userObject: saveObject, uid: user.uid });

    router.push("/home");
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
          className="absolute active:opacity-50 top-16 right-3 font-semibold 
      p-1 px-3"
          asChild
        >
          <Text>{params?.update ? "Vazgeç" : "Atla"}</Text>
        </Link>

        <Text className="font-bold w-full text-3xl">
          {params?.update
            ? "Bilgilerini güncelle"
            : "Bize biraz kendinden bahset ✨"}
        </Text>

        <Input
          className="w-full"
          placeholder="Yaşın"
          keyboardType="numeric"
          onChangeText={(text) => {
            setInfo((prevValues) => {
              return { ...prevValues, age: parseInt(text.toString()) };
            });
          }}
        />

        <Input
          className="w-full"
          placeholder="Mevcut Kilon"
          keyboardType="numeric"
          onChangeText={(text) => {
            setInfo((prevValues) => {
              return { ...prevValues, weight: parseInt(text.toString()) };
            });
          }}
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
            value={info?.gender || ""}
            placeholder="Cinsiyetin"
            className="w-full text-black"
            editable={false}
            onChangeText={() => {}}
          />
        </Pressable>

        <PrimaryButton
          onPress={handlePress}
          text={params?.update ? "Güncelle" : "Devam Et"}
          className="w-2/3"
        />

        <Text className="text-xs absolute bottom-4 text-center">
          * Bu bilgiler gelişiminizi takip etmeniz ve kalori ölçümlerinizin
          doğru olması açısından çok önemlidir.
        </Text>

        <View className="hidden">
          <Picker
            ref={pickerRef}
            selectedValue={info?.gender ? info.gender : "Erkek"}
            onValueChange={(pickedValue) =>
              pickedValue === "none"
                ? setInfo((prevValues) => {
                    return { ...prevValues, gender: undefined };
                  })
                : setInfo((prevValues) => {
                    return { ...prevValues, gender: pickedValue };
                  })
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

const useValidate = ({ info }: { info: UserInfo | null }) => {
  const validate = () => {
    if (!info || !info.age || !info.weight || !info.gender) {
      Alert.alert("Hata", "Lütfen bütün bilgileri doldurunuz.", [
        { text: "Tamam" },
      ]);
      return false;
    }

    const { age, weight, gender } = info;

    const parsedAge = validateAge(age);
    const parsedWeight = validateWeight(weight);
    const parsedGender = validateGender(gender);

    if (!parsedAge || !parsedWeight || !parsedGender) return false;

    const saveObject: UserInfo = {
      age: parsedAge,
      weight: parsedWeight,
      gender: parsedGender,
    };

    return saveObject;
  };

  return validate;
};
