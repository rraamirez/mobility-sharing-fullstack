export interface EcoRank {
  id?: number;
  name?: string;
}

export interface Role {
  id?: number;
  name?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  rupeeWallet: number;
  rating?: number;
  role?: Role;
  ecoRank?: EcoRank;
}

export interface TravelRecurrence {
  id?: number;
}

export interface Travel {
  id: number;
  driver: User;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: number;
  status?: "ACTIVE" | "CANCELED" | "COMPLETED";
  latitudeOrigin?: number | null;
  longitudeOrigin?: number | null;
  latitudeDestination?: number | null;
  longitudeDestination?: number | null;
  environmentalActionLevel?: "LOW" | "MEDIUM" | "HIGH";
  travelRecurrenceModel?: TravelRecurrence | null;
}

export interface UserTravel {
  id: number;
  user: User;
  travel: Travel;
  status: "pending" | "confirmed" | "canceled";
}

export interface Rating {
  id?: number;
  ratingUser?: User;
  ratedUser?: User;
  travel?: Travel;
  rating: number;
  comment?: string;
}

export interface WeeklyEnvironmentalStats {
  week?: string;
  totalTrips?: number;
  savedCo2?: number;
  savedMoney?: number;
  [key: string]: unknown;
}
