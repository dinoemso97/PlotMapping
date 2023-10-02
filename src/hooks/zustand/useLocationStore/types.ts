export interface PremiseState {
  premises: Premise[];
  substates: Substate[];
  customers: Customers[];
  courierLocations: CourierLocation[];
  setPremises: (premises: Premise[]) => void;
  fetchPremises: () => void;
}

export interface Coordinates {
  latitude: number | string;
  longitude: number | string;
  id: string;
  created_at: string;
  updated_at: string;
  created_by: number | string;
  updated_by: number | string;
  is_active: boolean;
  meta: any;
  premise_id: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}
export interface Location {
  coordinates: Coordinates[];
  setCoordinates: (coordinates: Coordinates[]) => void;
  gpsLocationFirst: LocationCoords;
  gpsStepFirst: boolean;
  setGpsLocationFirst: (gpslocationFirst: LocationCoords) => void;
  setGpsStepFirst: (gpsStepFirst: boolean) => void;
  gpsLocationSecond: LocationCoords;
  gpsStepSecond: boolean;
  setGpsLocationSecond: (gpslocationSecond: LocationCoords) => void;
  setGpsStepSecond: (gpsStepSecond: boolean) => void;
  gpsLocationThird: LocationCoords;
  gpsStepThird: boolean;
  setGpsLocationThird: (gpslocationThird: LocationCoords) => void;
  setGpsStepThird: (gpsStepThird: boolean) => void;
  gpsLocationFourth: LocationCoords;
  gpsStepFourth: boolean;
  setGpsLocationFourth: (gpslocationFourth: LocationCoords) => void;
  setGpsStepFourth: (gpsStepFourth: boolean) => void;
  gpsLocationFifth: LocationCoords;
  gpsStepFifth: boolean;
  setGpsLocationFifth: (gpslocationFifth: LocationCoords) => void;
  setGpsStepFifth: (gpsStepFifth: boolean) => void;
  gpsLocationSixth: LocationCoords;
  gpsStepSixth: boolean;
  setGpsLocationSixth: (gpslocationSixth: LocationCoords) => void;
  setGpsStepSixth: (gpsStepSixth: boolean) => void;
  gpsStepSeventh: boolean;
  setGpsStepSeventh: (gpsStepSeventh: boolean) => void;
}
