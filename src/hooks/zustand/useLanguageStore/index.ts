import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { LanguageState } from "./types";

export const useLanguageStore = create<LanguageState>()(
  devtools(
    persist(
      (set) => ({
        language: "en",
        setLanguage: (language: string) => set({ language }),
      }),
      {
        name: "language-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
