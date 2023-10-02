/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { LocationObject } from "expo-location";
import { t } from "i18n-js";
import { Center, Text } from "native-base";
import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import { MarkerIcon } from "../../../assets/images/svg";
import { Divider, MainHeader } from "../../components";
import { bodyStyles, textStyles } from "../../globalStyles";
import useTheme from "../../hooks/useTheme";
import { useLocationStore } from "../../hooks/zustand/useLocationStore";
import { Navigation } from "../../types";

interface MapScreenProps {
  navigation: Navigation;
}
/**
 * @description Map Screen
 * @author Dino Emso
 */

const MapScreen: FC<MapScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();

  const [locationData, setLocationData] = useState<string | number>();
  const [location, setLocation] = useState<string | LocationObject>("");

  const [noLocationText, setNoLocationText] = useState<string>(
    t("turnLocationServices")
  );

  const {
    coordinates,
    gpsLocationFirst,
    gpsLocationSecond,
    gpsLocationThird,
    gpsLocationFourth,
    gpsLocationFifth,
    gpsLocationSixth,
  } = useLocationStore();

  const [region, setRegion] = useState({
    latitude: gpsLocationFirst?.latitude,
    longitude: gpsLocationSecond?.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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

  useEffect(() => {
    fetchLocationName(gpsLocationFirst?.latitude, gpsLocationFirst?.longitude);
  }, [fetchLocationName, gpsLocationFirst]);

  return (
    <SafeAreaView style={bodyStyles.androidSafeArea}>
      <Divider size={30} />
      <Center
        borderBottomColor={theme.lightGrey}
        borderBottomWidth={1}
        zIndex={1}
        top={-80}
        bg="colors.gray.150"
        justifyContent="flex-end"
        width="100%"
        height={120}
      >
        <MainHeader
          onPressBtn={() => {
            navigation.goBack();
          }}
          profileScreen={t("map")}
        />
      </Center>
      <Center>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={localStyles.map}
          region={region}
          initialRegion={{
            latitude: gpsLocationFirst?.latitude,
            longitude: gpsLocationFirst?.longitude,
            latitudeDelta: 0.0001,
            longitudeDelta: 0.0001,
          }}
        >
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

          <Polyline
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
          />
        </MapView>
      </Center>
      <Center width="100%" style={localStyles.footerStyle} paddingTop={8}>
        <View style={[localStyles.coordinatesDiv]}>
          <View style={localStyles.yourCordinatesDiv}>
            <Text style={[textStyles.smallBold]}>{t("mapLocation")}</Text>
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
                    color: theme.darkBlue,
                  },
                ]}
              >
                {fullAddress ? fullAddress : noLocationText}
              </Text>
            </View>
          </View>
        </View>
      </Center>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
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
  map: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    transform: [{ translateY: -270 }],
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
});

export default MapScreen;
