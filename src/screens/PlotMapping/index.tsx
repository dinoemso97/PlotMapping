/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import { t } from "i18n-js";
import { Box, Center, Text } from "native-base";
import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
  Polygon,
} from "react-native-maps";

import {
  GpsPinIcon,
  GpsPinSilverIcon,
  MarkerIcon,
  MarkerIconRed,
} from "../../../assets/images/svg";
import { Divider, MainButton, MainHeader } from "../../components";
import { bodyStyles, textStyles } from "../../globalStyles";
import useTheme from "../../hooks/useTheme";
import { useLocationStore } from "../../hooks/zustand/useLocationStore";
import { Navigation } from "../../types";

interface PlotMappingScreenProps {
  navigation: Navigation;
}
/**
 * @description Plot Mapping Screen
 * @author Dino Emso
 */

const PlotMappingScreen: FC<PlotMappingScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [locationPermissionRequested, setLocationPermissionRequested] =
    useState(false);

  const [regionCoords, setRegionCoords] = useState<number>();
  const [changeResetBtn, setChangeResetBtn] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const [resetModalVisible, setResetModalVisible] = useState<boolean>(false);
  const [isDraggingMarker, setIsDraggingMarker] = useState(false);
  const [locationData, setLocationData] = useState<string | number>();
  const [confirmModalVisible, setConfirmModalVisible] =
    useState<boolean>(false);
  const [location, setLocation] = useState<string | LocationObject>("");
  const [errorMsg, setErrorMsg] = useState<string | number>();
  const [markerCoords, setMarkerCoords] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: 0, longitude: 0 });
  const [storeButtonText, setStoreButtonText] = useState<string>(
    t("storeLocation")
  );
  const [locationButtonText, setLocationButtonText] = useState<string>(
    t("fetchLocation")
  );
  const [noLocationText, setNoLocationText] = useState<string>(
    t("turnLocationServices")
  );
  const [plotNumber, setPlotNumber] = useState<string>("");
  const [plotNumberValid, setPlotNumberValid] = useState<boolean>(true);
  const [isGpsStored, setIsGpsStored] = useState<boolean>(false);
  const [isGpsStoredFirst, setIsGpsStoredFirst] = useState<boolean>(true);
  const [isGpsStoredSecond, setIsGpsStoredSecond] = useState<boolean>(false);
  const [isGpsStoredThird, setIsGpsStoredThird] = useState<boolean>(false);
  const [isGpsStoredFourth, setIsGpsStoredFourth] = useState<boolean>(false);
  const [isGpsStoredFifth, setIsGpsStoredFifth] = useState<boolean>(false);
  const [isGpsStoredSixth, setIsGpsStoredSixth] = useState<boolean>(false);
  const [isGpsStoredSeventh, setIsGpsStoredSeventh] = useState<boolean>(false);
  const {
    coordinates,
    gpsLocationFirst,
    gpsLocationSecond,
    gpsLocationThird,
    gpsLocationFourth,
    gpsLocationFifth,
    gpsLocationSixth,
    gpsStepFirst,
    gpsStepSecond,
    gpsStepThird,
    gpsStepFourth,
    gpsStepFifth,
    gpsStepSixth,
    gpsStepSeventh,
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
    setGpsStepSeventh,
  } = useLocationStore();

  const [region, setRegion] = useState({
    latitude: -1.286389,
    longitude: 36.817223,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const latitude = markerCoords?.latitude
    ? markerCoords?.latitude
    : region?.latitude;
  const longitude = markerCoords?.longitude
    ? markerCoords?.longitude
    : region?.longitude;

  /**
   * @description Fetches the location name of the user and sets the location name to the location name of the user
   * @author Dino Emso
   */
  const fetchLocationName = useCallback(
    async (latitude: any, longitude: any) => {
      // Fetch location name using reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        setLocationData(data);
        // Do something with the location name
      } catch (error) {
        console.log("Error fetching location name:", error);
      }
    },
    [location, setLocationData]
  );

  /**
   * @description Fetches the current location of the user and sets the region to the current location of the user
   * @author Dino Emso
   */
  const fetchLocation = useCallback(async () => {
    try {
      const locationOptions = {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
      };

      const locationSubscription = await Location.watchPositionAsync(
        locationOptions,
        async (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setLocation(newLocation);
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0001,
            longitudeDelta: 0.0001,
          });

          // Fetch location name using reverse geocoding
          await fetchLocationName(latitude, longitude);
          setMarkerCoords({ latitude, longitude });
        }
      );

      const cleanup = () => {
        locationSubscription && locationSubscription.remove();
      };

      return cleanup;
    } catch (error) {
      console.log("Error fetching location:", error);
    }
  }, [
    setLocation,
    setRegion,
    setMarkerCoords,
    setLocationButtonText,
    setLocationData,
  ]);

  /**
   * @description Calculates the angle between two points on the map
   * @author Dino Emso
   */
  const calculateAngle = useCallback(
    (
      center: { latitude: number; longitude: number },
      point: { latitude: number; longitude: number }
    ) => {
      const dy = point.latitude - center.latitude;
      const dx = point.longitude - center.longitude;
      let angleRad = Math.atan2(dy, dx);
      if (angleRad < 0) {
        angleRad += 2 * Math.PI;
      }
      return (angleRad * 180) / Math.PI;
    },
    []
  );

  /**
   * @description Sorts the coordinates of the polygon by angles relative to the center point
   * @author Dino Emso
   */
  const sortPolygonCoordinates = useCallback(
    (coordinates: any[]) => {
      const center = coordinates.reduce(
        (acc, coord) => {
          acc.latitude += coord.latitude;
          acc.longitude += coord.longitude;
          return acc;
        },
        { latitude: 0, longitude: 0 }
      );

      center.latitude /= coordinates.length;
      center.longitude /= coordinates.length;

      coordinates.sort((a, b) => {
        const angleA = calculateAngle(center, a);
        const angleB = calculateAngle(center, b);
        return angleA - angleB;
      });

      return coordinates;
    },
    [calculateAngle]
  );

  /**
   * @description Handle marker drag end event and set the marker coordinates to the new marker coordinates and fetch the location name of the new marker coordinates
   * @author Dino Emso
   */
  const handleMarkerDragEnd = async (e: {
    nativeEvent: { coordinate: any };
  }) => {
    const newMarkerCoords = e.nativeEvent.coordinate;
    setMarkerCoords(newMarkerCoords);
    setIsDraggingMarker(false);

    await fetchLocationName(
      newMarkerCoords.latitude,
      newMarkerCoords.longitude
    );
  };

  /**
   * @description Clears the locations of the polygon and sets the locations to the default locations of the polygon
   * @author Dino Emso
   */
  const clearLocations = async () => {
    setChangeResetBtn(true);
    setGpsLocationFirst({ latitude: 0, longitude: 0 });
    setGpsLocationSecond({ latitude: 0, longitude: 0 });
    setGpsLocationThird({ latitude: 0, longitude: 0 });
    setGpsLocationFourth({ latitude: 0, longitude: 0 });
    setGpsLocationFifth({ latitude: 0, longitude: 0 });
    setGpsLocationSixth({ latitude: 0, longitude: 0 });
  };

  /**
   * @description Calculates the area of the polygon using the coordinates of the polygon and the radius of the earth
   * @author Dino Emso
   */
  const squareCoordinates = useMemo(
    () =>
      sortPolygonCoordinates([
        {
          latitude: gpsLocationFirst?.latitude,
          longitude: gpsLocationFirst?.longitude,
        },
        {
          latitude: gpsLocationSecond?.latitude,
          longitude: gpsLocationSecond?.longitude,
        },
        {
          latitude: gpsLocationThird?.latitude
            ? gpsLocationThird?.latitude
            : gpsLocationSecond?.latitude,
          longitude: gpsLocationThird?.longitude
            ? gpsLocationThird?.longitude
            : gpsLocationSecond?.longitude,
        },
        {
          latitude: gpsLocationFourth?.latitude
            ? gpsLocationFourth?.latitude
            : gpsLocationSecond?.latitude,
          longitude: gpsLocationFourth?.longitude
            ? gpsLocationFourth?.longitude
            : gpsLocationSecond?.longitude,
        },
        {
          latitude: gpsLocationFifth?.latitude
            ? gpsLocationFifth?.latitude
            : gpsLocationSecond?.latitude,
          longitude: gpsLocationFifth?.longitude
            ? gpsLocationFifth?.longitude
            : gpsLocationSecond?.longitude,
        },
        {
          latitude: gpsLocationSixth?.latitude
            ? gpsLocationSixth?.latitude
            : gpsLocationSecond?.latitude,
          longitude: gpsLocationSixth?.longitude
            ? gpsLocationSixth?.longitude
            : gpsLocationSecond?.longitude,
        },
      ]),
    [
      gpsLocationFirst,
      gpsLocationSecond,
      gpsLocationThird,
      gpsLocationFourth,
      gpsLocationFifth,
      gpsLocationSixth,
      sortPolygonCoordinates,
    ]
  );

  const serverCoordinates = useMemo(
    () =>
      sortPolygonCoordinates(
        coordinates.map((coords) => ({
          latitude: coords.latitude,
          longitude: coords.longitude,
        }))
      ),
    [coordinates, sortPolygonCoordinates]
  );

  /**
   * @description Get address details from the location data and return the address details as a string
   * @author Dino Emso
   */
  const getAddressDetails = useCallback(() => {
    const village = locationData?.address?.village;
    const county = locationData?.address?.county;
    const road = locationData?.address?.road;
    const country = locationData?.address?.country;

    const addressParts = [];

    if (village) {
      addressParts.push(village);
    }

    if (county) {
      addressParts.push(county);
    }

    if (road) {
      addressParts.push(road);
    }

    if (country) {
      addressParts.push(country);
    }

    return addressParts.join(", ");
  }, [locationData]);

  const fullAddress = getAddressDetails();

  const handleCancel = () => {
    setConfirmModalVisible(false);
    setLocationButtonText(t("confirmMapping"));
  };

  useEffect(() => {
    setModalVisible(false);
    setNoLocationText(t("waitingLocation") + "...");
    setTimeout(() => {
      setModalVisible(true);
      setNoLocationText(t("tryAgainLocation"));
    }, 5000);
  }, []);

  const isFocused = useIsFocused();

  const requestLocationPermission = useCallback(async () => {
    if (!locationPermissionRequested) {
      setTimeout(() => {
        if (isFocused) {
          (async () => {
            const { status } =
              await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
              setErrorMsg(t("locationPermission"));
              return;
            }
            setLocationPermissionRequested(true);
            fetchLocation();
          })();
        }
      }, 1000);
      setModalVisible(false);
      setNoLocationText(t("waitingLocation") + "...");
      setTimeout(() => {
        setModalVisible(true);
        setNoLocationText(t("tryAgainLocation"));
      }, 5000);
    }
  }, [locationPermissionRequested, isFocused, navigation]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (location && !isGpsStored && !confirmModalVisible) {
      setLocationButtonText(t("storeLocation"));
    }
    if (isGpsStored && location && !gpsStepSixth) {
      setLocationButtonText(t("proceedToNextGpsPin"));
      setStoreButtonText(t("locationStored"));
    } else if (isGpsStored && gpsStepSixth && !confirmModalVisible) {
      setLocationButtonText(t("confirmMapping"));
      setStoreButtonText(t("locationsStored"));
    } else if (
      gpsLocationSecond?.latitude &&
      gpsLocationThird?.latitude &&
      gpsLocationFourth?.latitude &&
      gpsLocationFifth?.latitude &&
      gpsLocationSixth?.latitude &&
      coordinates.length === 0 &&
      confirmModalVisible
    ) {
      setLocationButtonText(t("waiting") + "...");
    } else if (
      (gpsLocationSecond?.latitude &&
        gpsLocationThird?.latitude &&
        gpsLocationFourth?.latitude &&
        gpsLocationFifth?.latitude &&
        gpsLocationSixth?.latitude) ||
      coordinates.length !== 0
    ) {
      setLocationButtonText(t("farmIsMapped"));
      setStoreButtonText(t("locationsStored"));
      setConfirmModalVisible(true);
    } else {
      setStoreButtonText(t("fetchLocation"));
    }
  }, [
    location,
    isGpsStored,
    gpsStepSixth,
    fetchLocation,
    gpsLocationSecond?.latitude,
    gpsLocationThird?.latitude,
    gpsLocationFourth?.latitude,
    gpsLocationFifth?.latitude,
    gpsLocationSixth?.latitude,
    coordinates?.length,
    changeResetBtn,
  ]);

  return (
    <SafeAreaView style={[bodyStyles.androidSafeArea]}>
      {resetModalVisible ? (
        <Center style={localStyles.resetModalCenter}>
          <View style={localStyles.resetModalCenterSecond}>
            <Text style={[textStyles.mainBold, localStyles.resetModalText]}>
              {t("resetFarm")}
            </Text>
            <View style={localStyles.resetBtn}>
              <TouchableOpacity
                onPress={() => {
                  setResetModalVisible(false);
                  setIsGpsStoredFourth(false);
                  setIsGpsStored(false);
                  setGpsStepSecond(false);
                  setGpsStepThird(false);
                  setGpsStepFourth(false);
                  setGpsStepFifth(false);
                  setGpsStepSixth(false);
                  setGpsStepSeventh(false);
                  setIsGpsStoredFirst(true);
                  clearLocations();
                }}
              >
                <Text color="colors.red.50" style={textStyles.regular}>
                  {t("reset")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setResetModalVisible(false)}>
                <Text color="colors.blue.50" style={textStyles.regular}>
                  {t("cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Center>
      ) : null}
      {confirmModalVisible ? (
        <Center style={localStyles.confirmModalCenter}>
          <View style={localStyles.confirmModalCenterSecond}>
            <Text style={[textStyles.mainBold, localStyles.resetModalText]}>
              {t("enterTheRowNumber")}
            </Text>
            <View>
              <TextInput
                style={[
                  localStyles.input,
                  {
                    borderWidth: 1,
                    borderColor: plotNumberValid ? "#E5E5E5" : "#F23F3F",
                  },
                ]}
                onChangeText={(text) => {
                  setPlotNumber(text);
                  setPlotNumberValid(true);
                }}
                value={plotNumber}
                placeholder={t("rowNumber")}
              />
            </View>
            <View style={localStyles.resetBtn}>
              <TouchableOpacity
                onPress={() => {
                  if (plotNumber) {
                    navigation.navigate("SectorsScreen");
                    setConfirmModalVisible(false);
                  } else {
                    setPlotNumberValid(false);
                  }
                }}
                style={[
                  localStyles.modalButtons,
                  {
                    backgroundColor: theme.darkBlue,
                  },
                ]}
              >
                <Text color="colors.primary.50" style={textStyles.regular}>
                  {t("save")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancel}
                style={[
                  localStyles.modalButtons,
                  {
                    backgroundColor: "#F23F3F",
                  },
                ]}
              >
                <Text color="colors.primary.50" style={textStyles.regular}>
                  {t("cancel")}
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setResetModalVisible(false);
                  setIsGpsStoredFourth(false);
                  setIsGpsStored(false);
                  setGpsStepSecond(false);
                  setGpsStepThird(false);
                  setGpsStepFourth(false);
                  setGpsStepFifth(false);
                  setGpsStepSixth(false);
                  setGpsStepSeventh(false);
                  setIsGpsStoredFirst(true);
                  setConfirmModalVisible(false);
                  clearLocations();
                }}
              >
                <Text
                  color="colors.blue.50"
                  style={[
                    textStyles.regular,
                    {
                      color: theme.darkBlue,
                      textDecorationLine: "underline",
                    },
                  ]}
                >
                  {t("beginMappingNextRow")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Center>
      ) : null}
      {!location && locationButtonText === "Fetch location" && modalVisible ? (
        <Center style={localStyles.modalErrorDiv}>
          <View
            style={[
              localStyles.notificationModal,
              {
                backgroundColor: theme.yellowGreen,
              },
            ]}
          >
            <Text
              color="colors.primary.50"
              style={[textStyles.littleRegular, localStyles.locationStore]}
            >
              {t("notLocationStored")}
            </Text>
            <View style={localStyles.locationModalBtn}>
              <TouchableOpacity
                onPress={() => requestLocationPermission()}
                style={localStyles.fetchLocationBtn}
              >
                <Text
                  color="colors.primary.50"
                  style={[textStyles.mainBold, localStyles.fetchLocationTxt]}
                >
                  {t("fetchLocation").toUpperCase()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={localStyles.fetchLocationBtn}
              >
                <Text
                  color="colors.primary.50"
                  style={[textStyles.mainBold, localStyles.fetchLocationTxt]}
                >
                  {t("close").toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Center>
      ) : null}
      <Center
        borderBottomColor={theme.lightGrey}
        borderBottomWidth={1}
        zIndex={1}
        marginTop={0}
        paddingTop={0}
        bg="colors.primary.50"
        justifyContent="flex-end"
        paddingBottom={5}
        width="100%"
        height={200}
        top={-60}
      >
        {gpsLocationFirst?.latitude !== 0 || coordinates.length !== 0 ? (
          <MainHeader
            onPressBtn={() => {
              // setGpsLocationFirst({ latitude: 0, longitude: 0 });
              // setGpsLocationSecond({ latitude: 0, longitude: 0 });
              // setGpsLocationThird({ latitude: 0, longitude: 0 });
              navigation.goBack();
            }}
            profileScreen={t("plotMapping")}
            rightText={t("reset")}
            rightButtonDisabled={false}
            rightTextColor={theme.darkBlue}
            right={5}
            onPressRightBtn={() => setResetModalVisible(true)}
          />
        ) : (
          <MainHeader
            onPressBtn={() => {
              // setGpsLocationFirst({ latitude: 0, longitude: 0 });
              // setGpsLocationSecond({ latitude: 0, longitude: 0 });
              // setGpsLocationThird({ latitude: 0, longitude: 0 });
              navigation.goBack();
            }}
            profileScreen={t("plotMapping")}
          />
        )}

        <Divider size={10} />
        <Box flexDirection="row" width="99%" justifyContent="space-evenly">
          <View style={localStyles.numberOfGps}>
            <View style={localStyles.gpsIconDiv}>
              {gpsStepFirst ? (
                <GpsPinIcon width={15} height={15} />
              ) : (
                <GpsPinSilverIcon width={15} height={15} />
              )}
              <Text
                style={[
                  textStyles.smaller,
                  {
                    color: gpsStepFirst ? theme.darkBlue : theme.rgba.lightGray,
                  },
                ]}
              >
                {t("gpsPinOne")}
              </Text>
            </View>
            <View style={localStyles.gpsLineDiv}>
              <View
                style={[
                  localStyles.gpsDiv,
                  {
                    backgroundColor: gpsStepSecond
                      ? theme.darkBlue
                      : theme.rgba.lightGray,
                  },
                ]}
              ></View>
            </View>
            <View style={localStyles.gpsIconDiv}>
              {(gpsStepFirst && gpsStepSecond) || coordinates.length !== 0 ? (
                <GpsPinIcon width={15} height={15} />
              ) : (
                <GpsPinSilverIcon width={15} height={15} />
              )}
              <Text
                style={[
                  textStyles.smaller,
                  {
                    color:
                      (gpsStepFirst && gpsStepSecond) ||
                      coordinates.length !== 0
                        ? theme.darkBlue
                        : theme.rgba.lightGray,
                  },
                ]}
              >
                {t("gpsPinTwo")}
              </Text>
            </View>
            <View style={localStyles.gpsLineDiv}>
              <View
                style={[
                  localStyles.gpsDiv,
                  {
                    backgroundColor:
                      gpsStepFirst && gpsStepThird
                        ? theme.darkBlue
                        : theme.rgba.lightGray,
                  },
                ]}
              ></View>
            </View>
            <View style={localStyles.gpsIconDiv}>
              {(gpsStepFirst && gpsStepSecond && gpsStepThird) ||
              coordinates.length !== 0 ? (
                <GpsPinIcon width={15} height={15} />
              ) : (
                <GpsPinSilverIcon width={15} height={15} />
              )}
              <Text
                style={[
                  textStyles.smaller,
                  {
                    color:
                      (gpsStepFirst && gpsStepSecond && gpsStepThird) ||
                      coordinates.length !== 0
                        ? theme.darkBlue
                        : theme.rgba.lightGray,
                  },
                ]}
              >
                {t("gpsPinThree")}
              </Text>
            </View>
            <View style={localStyles.gpsLineDiv}>
              <View
                style={[
                  localStyles.gpsDiv,
                  {
                    backgroundColor:
                      gpsStepFirst && gpsStepThird && gpsStepFourth
                        ? theme.darkBlue
                        : theme.rgba.lightGray,
                  },
                ]}
              ></View>
            </View>
            <View style={localStyles.gpsIconDiv}>
              {(gpsStepFirst &&
                gpsStepSecond &&
                gpsStepThird &&
                gpsStepFourth) ||
              coordinates.length !== 0 ? (
                <GpsPinIcon width={15} height={15} />
              ) : (
                <GpsPinSilverIcon width={15} height={15} />
              )}
              <Text
                style={[
                  textStyles.smaller,
                  {
                    color:
                      (gpsStepFirst &&
                        gpsStepSecond &&
                        gpsStepThird &&
                        gpsStepFourth) ||
                      coordinates.length !== 0
                        ? theme.darkBlue
                        : theme.rgba.lightGray,
                  },
                ]}
              >
                {t("gpsPinFour")}
              </Text>
            </View>
            <View style={localStyles.gpsLineDiv}>
              <View
                style={[
                  localStyles.gpsDiv,
                  {
                    backgroundColor:
                      gpsStepFirst &&
                      gpsStepThird &&
                      gpsStepFourth &&
                      gpsStepFifth
                        ? theme.darkBlue
                        : theme.rgba.lightGray,
                  },
                ]}
              ></View>
            </View>
            <View style={localStyles.gpsIconDiv}>
              {(gpsStepFirst &&
                gpsStepSecond &&
                gpsStepThird &&
                gpsStepFourth &&
                gpsStepFifth) ||
              coordinates.length !== 0 ? (
                <GpsPinIcon width={15} height={15} />
              ) : (
                <GpsPinSilverIcon width={15} height={15} />
              )}
              <Text
                style={[
                  textStyles.smaller,
                  {
                    color:
                      (gpsStepFirst &&
                        gpsStepSecond &&
                        gpsStepThird &&
                        gpsStepFourth &&
                        gpsStepFifth) ||
                      coordinates.length !== 0
                        ? theme.darkBlue
                        : theme.rgba.lightGray,
                  },
                ]}
              >
                {t("gpsPinFifth")}
              </Text>
            </View>
            <View style={localStyles.gpsLineDiv}>
              <View
                style={[
                  localStyles.gpsDiv,
                  {
                    backgroundColor:
                      gpsStepFirst &&
                      gpsStepThird &&
                      gpsStepFourth &&
                      gpsStepFifth &&
                      gpsStepSixth
                        ? theme.darkBlue
                        : theme.rgba.lightGray,
                  },
                ]}
              ></View>
            </View>
            <View style={localStyles.gpsIconDiv}>
              {(gpsStepFirst &&
                gpsStepSecond &&
                gpsStepThird &&
                gpsStepFourth &&
                gpsStepFifth &&
                gpsStepSixth) ||
              coordinates.length !== 0 ? (
                <GpsPinIcon width={15} height={15} />
              ) : (
                <GpsPinSilverIcon width={15} height={15} />
              )}
              <Text
                style={[
                  textStyles.smaller,
                  {
                    color:
                      (gpsStepFirst &&
                        gpsStepSecond &&
                        gpsStepThird &&
                        gpsStepFourth &&
                        gpsStepFifth &&
                        gpsStepSixth) ||
                      coordinates.length !== 0
                        ? theme.darkBlue
                        : theme.rgba.lightGray,
                  },
                ]}
              >
                {t("gpsPinSixth")}
              </Text>
            </View>
          </View>
        </Box>
      </Center>
      <Center>
        {location?.coords?.latitude && location?.coords?.longitude ? (
          <MapView
            //onRegionChangeComplete={region => setRegionCoords(region)}
            provider={PROVIDER_GOOGLE}
            style={localStyles.map}
            onPress={async (event) => {
              if (isGpsStored && location) {
                console.log("Proceed to the next GPS pin");
              } else {
                setMarkerCoords({
                  latitude: event.nativeEvent.coordinate.latitude,
                  longitude: event.nativeEvent.coordinate.longitude,
                });
                setIsDraggingMarker(false);
                await fetchLocationName(
                  event.nativeEvent.coordinate.latitude,
                  event.nativeEvent.coordinate.longitude
                );
              }
            }}
            region={region}
            initialRegion={{
              latitude:
                location.coords.latitude !== 0
                  ? location?.coords?.latitude
                  : -1.286389,
              longitude:
                location?.coords?.longitude !== 0
                  ? location?.coords?.longitude
                  : 36.817223,
              latitudeDelta: 0.0001,
              longitudeDelta: 0.0001,
            }}
          >
            {coordinates.length === 0 && !gpsLocationSixth?.latitude ? (
              markerCoords?.latitude !== 0 && markerCoords?.longitude !== 0 ? (
                <Marker
                  draggable
                  coordinate={{
                    latitude:
                      markerCoords?.latitude ??
                      regionCoords?.latitude ??
                      -1.286389,
                    longitude:
                      markerCoords?.longitude ??
                      regionCoords?.longitude ??
                      36.817223,
                  }}
                  onDragStart={() => setIsDraggingMarker(true)}
                  onDragEnd={handleMarkerDragEnd}
                  style={localStyles.markerStyle}
                >
                  {isDraggingMarker ? <MarkerIconRed /> : <MarkerIcon />}
                </Marker>
              ) : (
                <Marker
                  draggable
                  coordinate={region}
                  onDragStart={() => setIsDraggingMarker(true)}
                  onDragEnd={handleMarkerDragEnd}
                  style={localStyles.markerStyle}
                >
                  {isDraggingMarker ? <MarkerIconRed /> : <MarkerIcon />}
                </Marker>
              )
            ) : null}
            {serverCoordinates.length !== 0 && (
              <>
                <Marker
                  coordinate={{
                    latitude: serverCoordinates[0]?.latitude,
                    longitude: serverCoordinates[0]?.longitude,
                  }}
                >
                  <MarkerIcon />
                </Marker>
                <Marker
                  coordinate={{
                    latitude: serverCoordinates[1]?.latitude,
                    longitude: serverCoordinates[1]?.longitude,
                  }}
                >
                  <MarkerIcon />
                </Marker>
                <Marker
                  coordinate={{
                    latitude: serverCoordinates[2]?.latitude,
                    longitude: serverCoordinates[2]?.longitude,
                  }}
                >
                  <MarkerIcon />
                </Marker>
                <Marker
                  coordinate={{
                    latitude: serverCoordinates[3]?.latitude,
                    longitude: serverCoordinates[3]?.longitude,
                  }}
                >
                  <MarkerIcon />
                </Marker>
                <Marker
                  coordinate={{
                    latitude: serverCoordinates[4]?.latitude,
                    longitude: serverCoordinates[4]?.longitude,
                  }}
                >
                  <MarkerIcon />
                </Marker>
                <Marker
                  coordinate={{
                    latitude: serverCoordinates[5]?.latitude,
                    longitude: serverCoordinates[5]?.longitude,
                  }}
                >
                  <MarkerIcon />
                </Marker>
              </>
            )}

            {gpsLocationFirst?.latitude !== 0 &&
              gpsLocationFirst?.longitude !== 0 &&
              serverCoordinates.length === 0 && (
                <Marker
                  coordinate={{
                    latitude: gpsLocationFirst?.latitude,
                    longitude: gpsLocationFirst?.longitude,
                  }}
                >
                  <MarkerIcon />
                </Marker>
              )}

            {gpsLocationSecond?.latitude !== 0 &&
              gpsLocationSecond?.longitude !== 0 &&
              serverCoordinates.length === 0 && (
                <Marker
                  coordinate={{
                    latitude: gpsLocationSecond?.latitude,
                    longitude: gpsLocationSecond?.longitude,
                  }}
                >
                  <MarkerIcon />
                </Marker>
              )}
            {gpsLocationThird?.latitude !== 0 &&
              gpsLocationThird?.longitude !== 0 &&
              serverCoordinates.length === 0 && (
                <Marker
                  coordinate={{
                    latitude: gpsLocationThird?.latitude,
                    longitude: gpsLocationThird?.longitude,
                  }}
                >
                  <MarkerIcon />
                </Marker>
              )}
            {gpsLocationFourth?.latitude !== 0 &&
              gpsLocationFourth?.longitude !== 0 &&
              serverCoordinates.length === 0 && (
                <Marker
                  coordinate={{
                    latitude: gpsLocationFourth?.latitude,
                    longitude: gpsLocationFourth?.longitude,
                  }}
                >
                  <MarkerIcon />
                </Marker>
              )}
            {gpsLocationFifth?.latitude !== 0 &&
              gpsLocationFifth?.longitude !== 0 &&
              serverCoordinates.length === 0 && (
                <Marker
                  coordinate={{
                    latitude: gpsLocationFifth?.latitude,
                    longitude: gpsLocationFifth?.longitude,
                  }}
                >
                  <MarkerIcon />
                </Marker>
              )}
            {gpsLocationSixth?.latitude !== 0 &&
              gpsLocationSixth?.longitude !== 0 &&
              serverCoordinates.length === 0 && (
                <Marker
                  coordinate={{
                    latitude: gpsLocationSixth?.latitude,
                    longitude: gpsLocationSixth?.longitude,
                  }}
                >
                  <MarkerIcon />
                </Marker>
              )}

            {gpsLocationFirst?.latitude !== 0 &&
              gpsLocationFirst?.longitude !== 0 &&
              gpsLocationSecond?.latitude !== 0 &&
              gpsLocationSecond.longitude !== 0 &&
              coordinates.length === 0 && (
                <Polygon
                  coordinates={squareCoordinates}
                  strokeWidth={2}
                  strokeColor={theme.darkBlue}
                  fillColor={theme.darkBlue}
                />
              )}

            {coordinates.length !== 0 && (
              <Polygon
                coordinates={serverCoordinates}
                strokeWidth={2}
                strokeColor={theme.darkBlue}
                fillColor={theme.darkBlue}
              />
            )}

            {/* <Polyline
              coordinates={[
                {
                  latitude: gpsLocationFirst.latitude
                    ? gpsLocationFirst.latitude
                    : 0,
                  longitude: gpsLocationFirst.longitude
                    ? gpsLocationFirst.longitude
                    : 0,
                },
                {
                  latitude: gpsLocationSecond.latitude
                    ? gpsLocationSecond.latitude
                    : gpsLocationFirst.latitude,
                  longitude: gpsLocationSecond.longitude
                    ? gpsLocationSecond.longitude
                    : gpsLocationFirst.longitude,
                },
                {
                  latitude: gpsLocationThird.latitude
                    ? gpsLocationThird.latitude
                    : gpsLocationSecond.latitude
                    ? gpsLocationSecond.latitude
                    : gpsLocationFirst.latitude,
                  longitude: gpsLocationThird.longitude
                    ? gpsLocationThird.longitude
                    : gpsLocationSecond.longitude
                    ? gpsLocationSecond.longitude
                    : gpsLocationFirst.longitude,
                },
              ]}
              strokeColor={theme.darkBlue}
              strokeWidth={2}
            /> */}
          </MapView>
        ) : (
          <Center
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="50%"
          >
            <ActivityIndicator size="small" color="#2B3F6C" />
          </Center>
        )}
      </Center>
      <Center width="100%" style={localStyles.footerStyle} paddingTop={8}>
        <View style={[localStyles.coordinatesDiv]}>
          <View style={localStyles.yourCordinatesDiv}>
            <Text style={[textStyles.smallBold]}>{t("yourLocation")}</Text>
            <View
              style={[
                localStyles.coordinatesTextDiv,
                {
                  borderColor: theme.lightGrey,
                },
              ]}
            >
              <Text
                style={[
                  textStyles.littleRegular,
                  {
                    color:
                      location ||
                      noLocationText === t("waitingLocation") + "..."
                        ? theme.darkBlue
                        : theme.yellowGreen,
                  },
                ]}
              >
                {location && fullAddress ? fullAddress : noLocationText}
              </Text>
            </View>
          </View>

          <MainButton
            width="90%"
            height={60}
            text={locationButtonText}
            gradientColorFirst={
              locationButtonText === t("storeLocation")
                ? theme.rgba.buttonGray
                : theme.darkBlue
            }
            gradientColorSecond={
              locationButtonText === t("storeLocation")
                ? theme.rgba.buttonGray
                : theme.darkBlue
            }
            colorText={
              locationButtonText === t("storeLocation")
                ? theme.darkBlue
                : theme.primary
            }
            radius={12}
            boldText
            isDisabled={
              !(
                locationButtonText !== t("farmIsMapped") &&
                locationButtonText !== t("waiting") + "..."
              )
            }
            mainOpacity={
              locationButtonText !== t("farmIsMapped") &&
              locationButtonText !== t("waiting") + "..."
                ? 1
                : 0.6
            }
            buttonStyle={localStyles.mainButtonStyle}
            onBtnPress={() => {
              fetchLocation();
              if (locationButtonText === t("storeLocation")) {
                if (gpsStepFirst && isGpsStoredFirst) {
                  setIsGpsStored(true);
                  setIsGpsStoredSecond(true);
                  setIsGpsStoredFirst(false);
                  setGpsLocationFirst({
                    latitude: latitude ? latitude : 0,
                    longitude: longitude ? longitude : 0,
                  });
                }
                if (gpsStepSecond && isGpsStoredSecond) {
                  setIsGpsStored(true);
                  setIsGpsStoredThird(true);
                  setIsGpsStoredSecond(false);
                  setGpsLocationSecond({
                    latitude: latitude ? latitude : 0,
                    longitude: longitude ? longitude : 0,
                  });
                }
                if (gpsStepThird && isGpsStoredThird) {
                  setIsGpsStored(true);
                  setIsGpsStoredFourth(true);
                  setIsGpsStoredThird(false);
                  setGpsLocationThird({
                    latitude: latitude ? latitude : 0,
                    longitude: longitude ? longitude : 0,
                  });
                }
                if (gpsStepFourth && isGpsStoredFourth) {
                  setIsGpsStored(true);
                  setIsGpsStoredFifth(true);
                  setIsGpsStoredFourth(false);
                  setGpsLocationFourth({
                    latitude: latitude ? latitude : 0,
                    longitude: longitude ? longitude : 0,
                  });
                }
                if (gpsStepFifth && isGpsStoredFifth) {
                  setIsGpsStored(true);
                  setIsGpsStoredSixth(true);
                  setIsGpsStoredFifth(false);
                  setGpsLocationFifth({
                    latitude: latitude ? latitude : 0,
                    longitude: longitude ? longitude : 0,
                  });
                }
                if (gpsStepSixth && isGpsStoredSixth) {
                  setIsGpsStored(true);
                  setIsGpsStoredSeventh(true);
                  setIsGpsStoredSixth(false);
                  setGpsLocationSixth({
                    latitude: latitude ? latitude : 0,
                    longitude: longitude ? longitude : 0,
                  });
                  setConfirmModalVisible(true);
                }
              } else if (locationButtonText === t("confirmMapping")) {
                setConfirmModalVisible(true);
                setLocationButtonText(t("waiting") + "...");
              } else {
                if (gpsStepFirst && gpsLocationFirst?.latitude) {
                  setMarkerCoords({
                    latitude: 0,
                    longitude: 0,
                  });
                  setGpsStepSecond(true);
                  setIsGpsStored(false);
                }
                if (
                  gpsStepFirst &&
                  gpsStepSecond &&
                  gpsLocationSecond?.latitude
                ) {
                  setMarkerCoords({
                    latitude: 0,
                    longitude: 0,
                  });

                  setGpsStepThird(true);
                  setIsGpsStored(false);
                }
                if (
                  gpsStepFirst &&
                  gpsStepSecond &&
                  gpsStepThird &&
                  gpsLocationThird?.latitude
                ) {
                  setMarkerCoords({
                    latitude: 0,
                    longitude: 0,
                  });
                  setGpsStepFourth(true);
                  setIsGpsStored(false);
                }
                if (
                  gpsStepFirst &&
                  gpsStepSecond &&
                  gpsStepThird &&
                  gpsStepFourth &&
                  gpsLocationFourth?.latitude
                ) {
                  setMarkerCoords({
                    latitude: 0,
                    longitude: 0,
                  });
                  setGpsStepFifth(true);
                  setIsGpsStored(false);
                }
                if (
                  gpsStepFirst &&
                  gpsStepSecond &&
                  gpsStepThird &&
                  gpsStepFourth &&
                  gpsStepFifth &&
                  gpsLocationFifth?.latitude
                ) {
                  setMarkerCoords({
                    latitude: 0,
                    longitude: 0,
                  });
                  setGpsStepSixth(true);
                  setIsGpsStored(false);
                }
                if (
                  gpsStepFirst &&
                  gpsStepSecond &&
                  gpsStepThird &&
                  gpsStepFourth &&
                  gpsStepFifth &&
                  gpsStepSixth &&
                  gpsLocationSixth?.latitude
                ) {
                  setMarkerCoords({
                    latitude: 0,
                    longitude: 0,
                  });
                  setGpsStepSeventh(true);
                  setIsGpsStored(false);
                }
              }
            }}
          />
        </View>
      </Center>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  buttonStyle: {
    right: 5,
  },
  footerStyle: {
    position: "absolute",
    bottom: 40,
  },
  coordinatesDiv: {
    width: "90%",
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: "white",
  },
  fetchLocationBtn: {
    marginTop: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  fetchLocationTxt: {
    borderRadius: 12,
    justifyContent: "center",
    textDecorationLine: "underline",
    marginRight: 30,
  },
  coordinatesTextDiv: {
    width: "100%",
    height: 57,
    paddingLeft: 10,
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 5,
  },
  yourCordinatesDiv: {
    width: "90%",
  },
  mainButtonStyle: {
    marginTop: 15,
  },
  map: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    transform: [{ translateY: -270 }],
  },
  numberOfGps: {
    width: "92%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  gpsIconDiv: {
    justifyContent: "center",
    alignItems: "center",
    width: 55,
    height: 50,
  },
  gpsLineDiv: {
    justifyContent: "center",
    alignItems: "center",
    width: 7,
    height: 50,
  },
  modalErrorDiv: {
    zIndex: 2,
    top: "10%",
    position: "absolute",
    width: "100%",
  },
  resetModalText: {
    width: 200,
    textAlign: "center",
  },
  resetBtn: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  gpsDiv: {
    width: "100%",
    height: 1,
  },
  notificationModal: {
    width: "90%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 25,
    height: 140,
    textAlign: "center",
  },
  locationModalBtn: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-evenly",
  },
  resetModalCenter: {
    position: "absolute",
    top: 240,
    zIndex: 3,
    width: "100%",
  },
  resetModalCenterSecond: {
    width: "90%",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmModalCenter: {
    position: "absolute",
    top: 240,
    zIndex: 3,
    width: "100%",
  },
  confirmModalCenterSecond: {
    width: "90%",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: "#ccc",
    width: 320,
    top: -5,
    fontSize: 16,
  },
  markerStyle: {
    zIndex: 10,
  },
  locationStore: {
    width: 300,
    textAlign: "center",
  },
  modalButtons: {
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default PlotMappingScreen;
