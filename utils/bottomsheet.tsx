import {
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, StyleSheet } from "react-native";

export function getSnapPoints() {
  return useMemo(() => ["100%"], []);
}

export function getBackdrop() {
  return useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        opacity={0.5}
        enableTouchThrough={false}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={"none"}
        style={[
          { backgroundColor: "rgba(0, 0, 0, 1)" },
          StyleSheet.absoluteFillObject,
        ]}
      />
    ),
    []
  );
}

export function getOpenBottomSheet(
  bottomSheetRef: RefObject<BottomSheetModal | null>
) {
  return useCallback(() => {
    bottomSheetRef?.current?.present();
  }, []);
}

export function useCloseBottomSheetOnBackPressed(
  bottomSheetRef: RefObject<BottomSheetModal>,
  runOnBackPressed?: () => boolean
) {
  const [index, setIndex] = useState(-1);

  const onBackPress = () => {
    if (bottomSheetRef !== null) {
      console.log(typeof runOnBackPressed);
      // If a function is given by user
      if (typeof runOnBackPressed === "function") {
        // Run that function
        const result = runOnBackPressed();

        // If true is returned from that function
        // Close the bottom sheet, and don't go back
        if (result) {
          bottomSheetRef.current?.close();
          return true;
        }

        // If false is returned
        // Don't go back and don't close bottom sheet

        return true;
      } else {
        // If a function is not given
        // Close bottom sheet and don't go back
        bottomSheetRef.current?.close();
        return true;
      }
    }
  };

  useEffect(() => {
    if (index !== -1) {
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }
  }, [index]);

  return setIndex;
}
