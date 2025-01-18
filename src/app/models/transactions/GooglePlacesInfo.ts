import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from '@firebase/firestore';

export interface Distance {
  text?: string | null;
  value?: number | null;
}

export interface Duration {
  text?: string | null;
  value?: number | null;
}

export interface GeocodedWaypoints {
  geocoder_status?: string | null;
  place_id?: string | null;
  types?: string[] | null;
}

export interface Legs {
  distance?: Distance | null;
  duration?: Duration | null;
  start_address?: string | null;
  end_address?: string | null;
}

export interface OverviewPolyline {
  points?: string | null;
}

export interface Routes {
  summary?: string | null;
  overview_polyline?: OverviewPolyline | null;
  legs?: Legs[] | null;
}

export interface GooglePlacesInfo {
  geocoded_waypoints?: GeocodedWaypoints[] | null;
  routes?: Routes[] | null;
  status?: string | null;
}

export const GooglePlacesInfoConverter = {
  toFirestore: (data: GooglePlacesInfo) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as GooglePlacesInfo;
    return data;
  },
};
