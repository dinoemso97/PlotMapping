import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { LocationCoords, Location, Coordinates } from "./types";

export const useLocationStore = create<Location>()(
  devtools(
    persist(
      (set) => ({
        coordinates: [],
        setCoordinates: (coordinates: Coordinates[]) => {
          set({
            coordinates,
          });
        },
        gpsLocationFirst: {
          latitude: 0,
          longitude: 0,
        },
        gpsStepFirst: true,
        setGpsLocationFirst: (gpsLocationFirst: LocationCoords) =>
          set({ gpsLocationFirst }),
        setGpsStepFirst: (gpsStepFirst: boolean) => set({ gpsStepFirst }),
        gpsLocationSecond: {
          latitude: 0,
          longitude: 0,
        },
        gpsStepSecond: false,
        setGpsLocationSecond: (gpsLocationSecond: LocationCoords) =>
          set({ gpsLocationSecond }),
        setGpsStepSecond: (gpsStepSecond: boolean) => set({ gpsStepSecond }),
        gpsLocationThird: {
          latitude: 0,
          longitude: 0,
        },
        gpsStepThird: false,
        setGpsLocationThird: (gpsLocationThird: LocationCoords) =>
          set({ gpsLocationThird }),
        setGpsStepThird: (gpsStepThird: boolean) => set({ gpsStepThird }),
        gpsLocationFourth: {
          latitude: 0,
          longitude: 0,
        },
        gpsStepFourth: false,
        setGpsLocationFourth: (gpsLocationFourth: LocationCoords) =>
          set({ gpsLocationFourth }),
        setGpsStepFourth: (gpsStepFourth: boolean) => set({ gpsStepFourth }),
        gpsLocationFifth: {
          latitude: 0,
          longitude: 0,
        },
        gpsStepFifth: false,
        setGpsStepFifth: (gpsStepFifth: boolean) => set({ gpsStepFifth }),
        setGpsLocationFifth: (gpsLocationFifth: LocationCoords) =>
          set({ gpsLocationFifth }),

        gpsLocationSixth: {
          latitude: 0,
          longitude: 0,
        },
        gpsStepSixth: false,
        setGpsStepSixth: (gpsStepSixth: boolean) => set({ gpsStepSixth }),
        setGpsLocationSixth: (gpsLocationSixth: LocationCoords) =>
          set({ gpsLocationSixth }),
        gpsStepSeventh: false,
        setGpsStepSeventh: (gpsStepSeventh: boolean) => set({ gpsStepSeventh }),
      }),

      {
        name: "location-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
