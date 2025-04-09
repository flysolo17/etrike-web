import { QueryDocumentSnapshot } from "@angular/fire/firestore";


export const REPORTS_COLLECTION = "reports"

export interface Reports {
    id?: string | null;
    transactionID?: string | null;
    driver?: DriverInfo | null;
    passenger?: UserInfo | null;
    issues: string[];
    details?: string | null;
    createdAt: Date;
}


export const ReportsConverter = {
  toFirestore: (data: Reports) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Reports;
    data.createdAt = (data.createdAt as any).toDate();
    return data;
  },
};




export interface DriverInfo {
    id?: string | null;
    name?: string | null;
    profile?: string | null;
    franchiseNumber?: string | null;
    phone?: string | null;
}

export interface UserInfo {
    id?: string | null;
    name?: string | null;
    profile?: string | null;
    phone?: string | null;
}
