import { QueryDocumentSnapshot } from "@angular/fire/firestore";
import { DriverInfo, UserInfo } from "../report/report";

export enum EmergencyStatus {
    OPEN = "OPEN",
    SUSPENDED = "SUSPENDED"
}

export interface LocationInfo {
    latitude: number;
    longitude: number;
}

export interface Emergency {
    transactionID?: string | null;
    driverInfo?: DriverInfo | null;
    passengerInfo?: UserInfo | null;
    location?: LocationInfo | null;
    status: EmergencyStatus;
    createdAt: Date;
    updatedAt: Date;
}

export const EmergencyConverter = {
  toFirestore: (data: Emergency) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Emergency;
    data.createdAt = (data.createdAt as any).toDate();
    data.updatedAt = (data.updatedAt as any).toDate();
    return data;
  },
};


export const EMERGENCY_COLLECTION = "emergencies"