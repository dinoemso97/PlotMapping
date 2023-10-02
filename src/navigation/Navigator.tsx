import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import {
  PlotMapping,
  SectorsScreen,
  MapScreen,
  CoordinatesScreen,
} from "../screens";

const defaultStackOptions = {
  headerShown: false,
};

const RootStack = createNativeStackNavigator();
const RootStackScreen = () => {
  return (
    <RootStack.Navigator
      initialRouteName="SectorsScreen"
      screenOptions={{
        ...defaultStackOptions,
      }}
    >
      <RootStack.Screen name="SectorsScreen" component={SectorsScreen} />
      <RootStack.Screen name="PlotMapping" component={PlotMapping} />
      <RootStack.Screen name="MapScreen" component={MapScreen} />
      <RootStack.Screen
        name="CoordinatesScreen"
        component={CoordinatesScreen}
      />
    </RootStack.Navigator>
  );
};

export default function Navigator() {
  return <RootStackScreen />;
}
