import { ThemeContextProps } from "./ThemeContext";

//TODO: FIRSTLY, ADD THE NAME OF YOUR THEME TO Themes enum, and then to Theme type with | "themeName"
export enum Themes {
  light = "light",
  dark = "dark",
}
export type ThemeType = "light" | "dark";

//TODO: ADD ALL OF THE COLORS YOU WANT TO HAVE IN YOUR THEME
export enum ThemeAttributes {
  primary = "primary",
  secondary = "secondary",
  darkGreyText = "darkGreyText",
  lightGreyBorder = "lightGreyBorder",
  lightGreyBackground = "lightGreyBackground",
  pressableGreen = "pressableGreen",
  moneyGreen = "moneyGreen",
  problemRed = "problemRed",
  borderLightGrey = "borderLightGrey",
}

const textColors = {
  darkGreyText: "#494642",
};

//TODO: ADD YOUR THEMES INSIDE THE themes object, TYPESCRIPT WILL WARN YOU IF YOU MESS UP
export const themes: ThemeContextProps = {
  light: {
    primary: "white",
    secondary: "#141414",
    black: "#000000",
    gray: "#f3f3f3",
    mediumGrey: "#3C3C43",
    darkGrey: "#3B3B43",
    pressableGreen: "#0F993E",
    lightGrey: "#E7E7E7",
    buttonGray: "#F6F6F8",
    green: "#07B282",
    limeGreen: "#A0D017",
    lightGreen: "#48CA59",
    darkGreen: "#0F993E",
    yellowGreen: "#CDD10F",
    modalGreen: "#2DC281",
    lightBlue: "#09C7E1",
    darkBlue: "#2B3F6C",
    orangeGolden: "#F1A63F",
    red: "#F23F3F",
    rgba: {
      lightGray: "rgba(0,0,0,0.5)",
      gray: "rgba(154, 154, 175, 0.12)",
      darkGray: "rgba(21, 21, 21, 0.5)",
      shadow: "rgba(20, 20, 20, 0.1)",
      darkShadow: "rgba(177, 177, 186, 0.1)",
      mediumGray: "rgba(37, 37, 67, 0.04)",
      tertiaryGray: "rgba(60, 60, 67, 0.3)",
      buttonGray: "rgba(144, 144, 157, 0.1)",
      borderColor: "rgba(0, 0, 0, 0.05)",
    },
    gradient: {
      lightGreen: "#7CE27E",
      darkGreen: "#07B282",
    },
    ...textColors,
  },
  dark: {
    primary: "purple",
    secondary: "white",
    black: "#000000",
    gray: "#cccccc",
    mediumGrey: "#3C3C43",
    darkGrey: "#3B3B43",
    lightGrey: "#E7E7E7",
    buttonGray: "#F6F6F8",
    green: "#07B282",
    pressableGreen: "#009988",
    limeGreen: "#A0D017",
    lightGreen: "#48CA59",
    darkGreen: "#0F993E",
    yellowGreen: "#CDD10F",
    modalGreen: "#2DC281",
    lightBlue: "#09C7E1",
    darkBlue: "#2B3F6C",
    orangeGolden: "#F1A63F",
    red: "#F23F3F",
    rgba: {
      lightGray: "rgba(0,0,0,0.5)",
      gray: "rgba(154, 154, 175, 0.12)",
      shadow: "rgba(20, 20, 20, 0.1)",
      darkShadow: "rgba(177, 177, 186, 0.1)",
      lightGray: "rgba(120, 120, 128, 0.16)",
      mediumGray: "rgba(37, 37, 67, 0.04)",
      tertiaryGray: "rgba(60, 60, 67, 0.3)",
      buttonGray: "rgba(144, 144, 157, 0.1)",
      borderColor: "rgba(0, 0, 0, 0.05)",
    },
    gradient: {
      lightGreen: "#7CE27E",
      darkGreen: "#07B282",
    },
    ...textColors,
  },
};

export const nativeBaseTheme = {
  colors: {
    primary: {
      50: "#FFFFFF",
      100: "#141414",
    },

    green: {
      50: "#7CE27E",
      100: "#07B282",
      200: "#55C963", //Main green
      300: "#0F993E",
      400: "#2DC281",
      500: "#CDD10F", //Yellow green
    },
    gradientBox: {
      50: "#A0D017",
      100: "#48CA59",
      200: "#09C7E1",
    },
    gray: {
      50: "#E4E7EF",
      100: "#90909D", //Main gray
      150: "#F3F3F3", //Background color
      200: "#B7B7B7",
      300: "#2B3F6C",
      400: "#B1B1BA",
      450: "#9E9EA1",
    },
    rgbaGray: {
      50: "rgba(37, 37, 67, 0.04)",
    },
    orange: {
      50: "#F1A63F",
    },
    red: {
      50: "#F23F3F",
    },
    rgbaRed: {
      50: "rgba(242, 63, 63, 0.1)",
    },
  },
  rgbaColors: {
    gray: {
      50: "rgba(154, 154, 175, 0.12)",
      100: "rgba(37, 37, 67, 0.04)",
    },
    shadow: {
      50: "rgba(20, 20, 20, 0.1)",
    },
    blue: {
      50: "2B3F6C",
    },
  },
};
