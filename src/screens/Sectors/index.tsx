/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { collection, getDocs } from "firebase/firestore";
import { t } from "i18n-js";
import { Center, Text, View } from "native-base";
import React, { FC, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import { RightIcon, DownIcon } from "../../../assets/images/svg";
import { db } from "../../../firebaseConfig.js";
import { Divider, MainHeader, DropDownPicker } from "../../components";
import { bodyStyles, textStyles } from "../../globalStyles";
import useTheme from "../../hooks/useTheme";
import { useLocationStore } from "../../hooks/zustand/useLocationStore";
import { Navigation } from "../../types";

interface SectorsScreenProps {
  navigation: Navigation;
}
/**
 * @description Sector Screen
 * @author Dino Emso
 */

const SectorsScreen: FC<SectorsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [component, setComponent] = useState<string | number>();
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<any>();
  const [sectorData, setSectorData] = useState<any>([]);
  const {
    gpsLocationThird,
    setGpsLocationFirst,
    setGpsLocationSecond,
    setGpsLocationThird,
    setGpsLocationFourth,
    setGpsLocationFifth,
    setGpsLocationSixth,
    setGpsStepSecond,
    setGpsStepThird,
    setGpsStepFourth,
    setGpsStepFifth,
    setGpsStepSixth,
  } = useLocationStore();

  /**
   * @description Clears the locations of the polygon and sets the locations to the default locations of the polygon
   * @author Dino Emso
   */
  const clearLocations = () => {
    setGpsLocationFirst({ latitude: 0, longitude: 0 });
    setGpsLocationSecond({ latitude: 0, longitude: 0 });
    setGpsLocationThird({ latitude: 0, longitude: 0 });
    setGpsLocationFourth({ latitude: 0, longitude: 0 });
    setGpsLocationFifth({ latitude: 0, longitude: 0 });
    setGpsLocationSixth({ latitude: 0, longitude: 0 });
    setGpsStepSecond(false);
    setGpsStepThird(false);
    setGpsStepFourth(false);
    setGpsStepFifth(false);
    setGpsStepSixth(false);
  };

  const noCoordinatesData = [
    {
      id: 0,
      label: t("mapRows"),
      value: "PlotMapping",
      name: "Sector 1",
      number: 1,
    },
  ];

  const data = [
    {
      id: 0,
      label: t("seeMap"),
      value: "MapScreen",
      name: "Sector 1",
      number: 1,
    },
    {
      id: 1,
      label: t("seeCoordinatesByRow"),
      value: "CoordinatesScreen",
      name: "Sector 2",
      number: 2,
    },
    {
      id: 2,
      label: t("editRow"),
      value: "PlotMapping",
      name: "Sector 3",
      number: 3,
    },
    {
      id: 3,
      label: t("deleteCoordinates"),
      value: () => clearLocations(),
      name: "Sector 4",
      number: 4,
    },
  ];

  /**
   * @description Handles the change of the dropdown picker and navigates to the selected screen
   * @author Dino Emso
   */
  const handleChangeItem = (item: number) => {
    if (item.id === 3) {
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 5000);
      item.value();
      return;
    }
    setComponent(t("sector").toUpperCase() + " " + item?.id);
    navigation.navigate(item?.value);
  };

  const getAllSectorsWithCoordinates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "sectors"));
      querySnapshot.forEach((doc) => {
        setSectorData((prev: any) => [...prev, doc.data()]);
      });
    } catch (error) {
      console.log("There was an error to fetch data from firestore", error);
      throw error;
    }
  };

  useEffect(() => {
    getAllSectorsWithCoordinates();
  }, []);

  return (
    <SafeAreaView style={bodyStyles.androidSafeArea}>
      <Divider size={10} />
      {modalVisible ? (
        <Center style={localStyles.modalErrorDiv}>
          <View
            style={[
              localStyles.notificationModal,
              {
                backgroundColor: theme.green,
              },
            ]}
          >
            <Text
              color="colors.primary.50"
              style={[textStyles.littleRegular, localStyles.locationStore]}
            >
              {t("successfullyDeletedCoords")}
            </Text>
          </View>
        </Center>
      ) : null}
      <Center borderBottomColor={theme.lightGrey} bg="colors.gray.150">
        <MainHeader profileScreen={t("sectorMapping")} />
        {data.map((item, index) => (
          <DropDownPicker
            key={item.id}
            subjectText=""
            data={
              gpsLocationThird.latitude === 0 &&
              gpsLocationThird.longitude === 0
                ? noCoordinatesData
                : data
            }
            placeholder={t("sector") + " " + item.number}
            onChange={handleChangeItem}
            value={component}
            onFocus={() => {
              setIsFocus(true);
              setComponent("");
              setSelectedValue(index);
            }}
            onBlur={() => setIsFocus(false)}
            placeholderStyle={localStyles.placeholderStyles}
            rightIcon={() =>
              isFocus && index === selectedValue ? (
                <DownIcon
                  width={25}
                  height={25}
                  style={localStyles.iconsStyle}
                />
              ) : (
                <RightIcon
                  width={25}
                  height={25}
                  style={localStyles.iconsStyle}
                />
              )
            }
          />
        ))}
      </Center>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  modalErrorDiv: {
    zIndex: 2,
    top: "10%",
    position: "absolute",
    width: "100%",
  },
  notificationModal: {
    width: "90%",
    borderRadius: 10,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 25,
    height: 120,
    textAlign: "center",
  },
  locationStore: {
    width: "80%",
    textAlign: "center",
  },
  placeholderStyles: {
    fontWeight: "bold",
    color: "#2B3F6C",
  },
  iconsStyle: {
    marginRight: 10,
  },
});

export default SectorsScreen;
