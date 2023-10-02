import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { textStyles } from "../../globalStyles";

interface MainButtonProps {
  text: string;
  onBtnPress: () => void;
  svgIcon?: FC<SvgProps>;
  width: string | number;
  height: string | number;
  radius: number;
  borderWidth: number;
  borderColor: string;
  shadowColor: string;
  shadowWidth: number;
  shadowHeight: number;
  opacity: number;
  buttonColor: string;
  colorText: string;
  isShadow: boolean;
  withoutText: boolean;
  withoutIcon: boolean;
  buttonStyle: any;
  isGradient: boolean;
  gradientColorFirst: string;
  gradientColorSecond: string;
  boldText: boolean;
  isDisabled: boolean;
  opacityButton: number;
  activeOpacity: number;
  fontSize: number;
  mainOpacity: number;
}

const MainButton = ({
  text,
  onBtnPress,
  svgIcon,
  width,
  height,
  radius,
  borderWidth,
  borderColor,
  shadowColor,
  shadowWidth,
  shadowHeight,
  opacity,
  buttonColor,
  colorText,
  isShadow,
  withoutText,
  withoutIcon,
  buttonStyle,
  gradientColorFirst,
  gradientColorSecond,
  boldText,
  isDisabled,
  opacityButton,
  activeOpacity,
  fontSize,
  mainOpacity,
}: MainButtonProps) => {
  return (
    <>
      <TouchableOpacity
        onPress={onBtnPress}
        disabled={isDisabled ? isDisabled : false}
        style={[
          isShadow ? localStyles.buttonDivShadow : localStyles.buttonDiv,
          buttonStyle,
          isShadow
            ? {
                width: width,
                height: height,
                backgroundColor: buttonColor,
                borderRadius: radius,
                shadowColor: shadowColor,
                shadowOffset: {
                  width: shadowWidth,
                  height: shadowHeight,
                },
                borderWidth: borderWidth,
                borderColor: borderColor,
                shadowOpacity: opacity,
                opacity: mainOpacity,
              }
            : {
                width: width,
                height: height,
                backgroundColor: buttonColor,
                borderRadius: radius,
                borderWidth: borderWidth,
                borderColor: borderColor,
                shadowOpacity: opacityButton,
                activeOpacity: activeOpacity,
                opacity: mainOpacity,
              },
        ]}
      >
        <LinearGradient
          colors={
            !buttonColor
              ? [gradientColorFirst, gradientColorSecond]
              : [buttonColor, buttonColor]
          }
          start={{ x: 0, y: 5 }}
          end={{ x: 1, y: 1 }}
          style={[
            localStyles.linearGradientStyle,
            {
              borderRadius: radius,
            },
          ]}
        >
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              right: withoutText ? 0 : 5,
            }}
          >
            {!withoutIcon ? svgIcon : null}
          </View>
          {!withoutText ? (
            <Text
              style={[
                boldText ? textStyles.mainBold : textStyles.littleRegular,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  color: colorText,
                  left: svgIcon ? 7 : 0,
                  fontSize: !boldText ? fontSize : 14,
                },
                localStyles.buttonText,
              ]}
            >
              {text}
            </Text>
          ) : null}
        </LinearGradient>
      </TouchableOpacity>
    </>
  );
};

const localStyles = StyleSheet.create({
  buttonDiv: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttonDivShadow: {
    shadowRadius: 10,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  linearGradientStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  buttonText: {
    top: 1,
  },
});

export default MainButton;
