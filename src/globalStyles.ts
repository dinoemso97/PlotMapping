import { StyleSheet, Platform, StatusBar } from "react-native";

export const textStyles = StyleSheet.create({
  // Open Sans
  h4: {
    fontFamily: "Poppins_500Medium",
    fontSize: 25,
    lineHeight: 30,
  },
  medium: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  mainText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    lineHeight: 25,
    fontWeight: "600",
  },
  mainBold: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    lineHeight: 25,
    fontWeight: "600",
  },
  smaller: {
    fontFamily: "Poppins_500Medium",
    fontSize: 9,
    lineHeight: 22,
    fontWeight: "500",
  },
  small: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    lineHeight: 22,
    fontWeight: "400",
  },
  smallBold: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    lineHeight: 20,
    fontWeight: "500",
  },
  littleThinlyRegular: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
  },
  littleRegular: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  littleBold: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400",
  },
  littleItalic: {
    fontStyle: "italic",
  },
  biggerBold: {
    fontFamily: "Poppins_500Medium",
    fontSize: 25,
    lineHeight: 30,
    fontWeight: "600",
  },
  regular: {
    fontFamily: "Poppins_500Medium",
    fontSize: 17,
    fontWeight: "400",
  },
  regularBold: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 25,
  },
  regularMedium: {
    fontFamily: "Poppins_500Medium",
    fontSize: 17,
    fontWeight: "500",
  },
  regularSemiBoldMedium: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
    fontWeight: "500",
  },
  regularBoldMedium: {
    fontFamily: "Poppins_500Medium",
    fontSize: 17,
    fontWeight: "600",
  },
  regularBoldest: {
    fontFamily: "Poppins_500Medium",
    fontSize: 17,
    fontWeight: "700",
  },
  regularBolder: {
    fontFamily: "Poppins_500Medium",
    fontSize: 17,
    fontWeight: "700",
  },
  regularBigBold: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 31,
  },
  bodyLarge: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export const bodyStyles = StyleSheet.create({
  androidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#F3F3F3",
    paddingBottom: 0,
  },
  mainDiv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  regularDiv: {
    justifyContent: "center",
    alignItems: "center",
  },
  leftTextDiv: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  drawerStyle: {
    width: "80%",
    opacity: 0.95,
  },
});
