import React from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import { textStyles } from "../../globalStyles";
import useTheme from "../../hooks/useTheme";

interface DropDownPickerProps {
  subjectText: string;
  isValidate: boolean;
  data: any;
  maxHeight: number;
  placeholder: string;
  value: any;
  search: boolean;
  onOpen: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onChange: () => void;
  searchPlaceholder?: string;
  placeholderStyle?: any;
  rightIcon?: any;
}

const DropDownPicker = ({
  data,
  maxHeight,
  placeholder,
  value,
  search,
  onOpen,
  onFocus,
  onBlur,
  onChange,
  searchPlaceholder,
  placeholderStyle,
  rightIcon,
}: DropDownPickerProps) => {
  const { theme } = useTheme();
  return (
    <>
      <Dropdown
        data={data}
        maxHeight={maxHeight}
        searchPlaceholder={searchPlaceholder ? searchPlaceholder : ""}
        search={search ? search : false}
        labelField="label"
        valueField="name"
        placeholder={placeholder}
        iconStyle={localStyles.iconStyle}
        value={value}
        selectedTextStyle={[
          textStyles.mainBold,
          localStyles.selectedItemStyles,
        ]}
        itemTextStyle={[textStyles.smallBold, localStyles.itemTextStyle]}
        iconColor={theme.black}
        onOpen={onOpen}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        style={[localStyles.dropdown]}
        containerStyle={localStyles.containerStyle}
        activeColor="#2B3F6C"
        visibleSelectedItem={false}
        alwaysRenderSelectedItem={false}
        confirmUnSelectItem={false}
        confirmSelectItem={false}
        itemContainerStyle={localStyles.itemContainerStyle}
        selectedStyle={localStyles.selectedStyles}
        placeholderStyle={placeholderStyle}
        renderRightIcon={rightIcon}
      />
    </>
  );
};

const localStyles = StyleSheet.create({
  dropdown: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 8,
    marginTop: 12,
    paddingLeft: 20,
    right: 2,
    textAlign: "center",
  },
  iconStyle: {
    width: 34,
    height: 34,
  },
  itemTextStyle: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "600",
    borderRadius: 10,
    fontSize: 16,
  },
  containerStyle: {
    backgroundColor: "#2B3F6C",
    width: "92%",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    padding: 10,
    color: "#111111",
  },
  placeholderStyle: {
    fontWeight: "bold",
    color: "#2B3F6C",
  },
  itemContainerStyle: {
    borderRadius: 10,
    backgroundColor: "#2B3F6C",
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: -15,
    top: 10,
  },
  selectedStyles: {
    borderRadius: 10,
  },
  selectedItemStyles: {
    fontWeight: "bold",
    color: "#2B3F6C",
    borderRadius: 20,
  },
});

export default DropDownPicker;
