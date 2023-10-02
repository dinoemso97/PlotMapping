import { t } from "i18n-js";
import { Center, Text, View } from "native-base";
import React, { FC } from "react";
import { SafeAreaView, StyleSheet, FlatList } from "react-native";

import { Divider, MainHeader } from "../../components";
import { bodyStyles, textStyles } from "../../globalStyles";
import useTheme from "../../hooks/useTheme";
import { useLocationStore } from "../../hooks/zustand/useLocationStore";
import { Navigation } from "../../types";

interface CoordinatesProps {
  navigation: Navigation;
}
/**
 * @description Coordinates Screen
 * @author Dino Emso
 */

const Coordinates: FC<CoordinatesProps> = ({ navigation }) => {
  const { theme } = useTheme();

  const { gpsLocationFirst, gpsLocationSecond, gpsLocationThird } =
    useLocationStore();

  const dataRow = [
    {
      id: 0,
      name: "Row 1",
    },
  ];

  const data = [gpsLocationFirst, gpsLocationSecond, gpsLocationThird];

  return (
    <SafeAreaView style={bodyStyles.androidSafeArea}>
      <Divider size={10} />
      <MainHeader
        profileScreen={t("coordinates")}
        onPressBtn={() => {
          navigation.goBack();
        }}
      />
      <Center borderBottomColor={theme.lightGrey} bg="colors.gray.150">
        {dataRow.map((item) => {
          return (
            <View style={localStyles.rowDiv}>
              <Text
                style={{
                  ...textStyles.regularBigBold,
                }}
              >
                {item.name + ":"}
              </Text>
              <FlatList
                data={data}
                style={localStyles.flatListDiv}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={localStyles.containerStyles}
                renderItem={({ item, index }) => {
                  return (
                    <View
                      style={[
                        localStyles.coordinatesDiv,
                        {
                          borderBottomColor: theme.lightGrey,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          ...textStyles.regularBigBold,
                        }}
                      >
                        {t("coordsGps")} {index + 1}
                      </Text>
                      <View style={localStyles.latlonDiv}>
                        <Text
                          style={{
                            ...textStyles.regular,
                            color: "#737373",
                          }}
                        >
                          {t("latitude")}: {item.latitude}
                        </Text>
                        <Text
                          style={{
                            ...textStyles.regular,
                            color: "#737373",
                          }}
                        >
                          {t("latitude")}: {item.longitude}
                        </Text>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(index) => index.toString()}
              />
            </View>
          );
        })}
      </Center>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  locationStore: {
    width: "80%",
    textAlign: "center",
  },
  flatListDiv: {
    width: "90%",
    paddingBottom: 20,
  },
  coordinatesDiv: {
    width: "100%",
    height: 90,
    marginTop: 20,
    borderBottomWidth: 1,
  },
  latlonDiv: {
    marginTop: 10,
    paddingVertical: 5,
    justifyContent: "space-between",
  },
  containerStyles: {
    paddingBottom: 30,
  },
  rowDiv: {
    width: "90%",
    marginTop: 20,
    borderWidth: 1,
    padding: 20,
    borderRadius: 20,
    borderColor: "#a6a6a6",
  },
});

export default Coordinates;
