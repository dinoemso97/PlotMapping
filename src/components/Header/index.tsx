import { t } from "i18n-js";
import { Text, Center, Container } from "native-base";
import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";

import { BackIcon } from "../../../assets/images/svg";
import { bodyStyles, textStyles } from "../../globalStyles";
import useTheme from "../../hooks/useTheme";
import MainButton from "../MainButton/";

interface HeaderProps {
  profileScreen?: string;
  rightText?: string;
  backText?: string;
  onPressBtn: () => void;
  onPressRightBtn?: () => void;
  onPressMainButton?: () => void;
  mainButtonRightText?: string;
  height?: number | string;
  mainBtnRight?: boolean;
  mainBtnRightStyle?: any;
  mainBtnRightWidth?: number;
  mainBtnRightHeight?: number;
  rightTextColor?: string;
  right?: number | string;
  rightButtonDisabled?: boolean;
}

const Header = ({
  profileScreen,
  backText,
  rightText,
  onPressBtn,
  onPressRightBtn,
  onPressMainButton,
  mainButtonRightText,
  height,
  mainBtnRightStyle,
  mainBtnRightWidth,
  mainBtnRightHeight,
  rightTextColor,
  right,
  rightButtonDisabled,
}: HeaderProps) => {
  const { theme } = useTheme();
  return (
    <Center
      height={height ? height : 60}
      flexDirection="row"
      justifyContent="space-evenly"
    >
      {onPressBtn ? (
        <TouchableOpacity
          onPress={onPressBtn}
          style={[bodyStyles.regularDiv, localStyles.btnDiv]}
        >
          <View style={localStyles.btnDivSecond}>
            <BackIcon style={localStyles.backBtnIcon} />
            <Text
              style={[
                textStyles.regularBoldMedium,
                localStyles.backBtnText,
                { color: theme.darkBlue },
              ]}
            >
              {backText ? backText : t("back")}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[bodyStyles.regularDiv, localStyles.btnDiv]} />
      )}

      <Container width="55%" height="100%" style={bodyStyles.regularDiv}>
        <Text
          style={[
            textStyles.bodyLarge,
            localStyles.screenNameText,
            {
              left: profileScreen.length > 20 ? 15 : 5,
            },
          ]}
        >
          {profileScreen}
        </Text>
      </Container>
      {rightText ? (
        <TouchableOpacity
          disabled={rightButtonDisabled ? rightButtonDisabled : false}
          style={[
            bodyStyles.regularDiv,
            localStyles.rightTextDiv,
            {
              right: right ? right : 0,
              opacity: rightButtonDisabled ? 0.5 : 1,
            },
          ]}
          onPress={onPressRightBtn}
        >
          <Text
            color={rightTextColor ? rightTextColor : "colors.gray.100"}
            style={[
              textStyles.regularMedium,
              localStyles.rightTextStyle,
              {
                left: profileScreen.length > 15 ? 10 : -25,
              },
            ]}
          >
            {rightText}
          </Text>
        </TouchableOpacity>
      ) : (
        <Container width={mainBtnRightHeight ? "5%" : "22%"} height="100%" />
      )}

      {mainButtonRightText ? (
        <MainButton
          width={mainBtnRightWidth}
          height={mainBtnRightHeight}
          text={mainButtonRightText}
          gradientColorFirst={theme.gradient.lightGreen}
          gradientColorSecond={theme.gradient.darkGreen}
          colorText={theme.primary}
          radius={8}
          onBtnPress={onPressMainButton}
          boldText
          buttonStyle={[
            mainBtnRightStyle,
            localStyles.mainBtnLocalStyle,
            {
              left: profileScreen.length > 15 ? 8 : -25,
            },
          ]}
        />
      ) : null}
    </Center>
  );
};

const localStyles = StyleSheet.create({
  btnDiv: {
    width: "23%",
    height: "100%",
    flexDirection: "row",
  },
  btnDivSecond: {
    width: "63%",
    flexDirection: "row",
    justifyContent: "space-between",
    right: 5,
  },
  backBtnIcon: {
    left: 5,
  },
  backBtnText: {
    left: 12,
    top: 1,
  },
  rightTextStyle: {
    width: 120,
    position: "absolute",
  },
  screenNameText: {
    right: 3,
  },
  rightTextDiv: {
    width: "22%",
    height: "100%",
  },
  mainBtnLocalStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
