import {
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { RefObject, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";

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
