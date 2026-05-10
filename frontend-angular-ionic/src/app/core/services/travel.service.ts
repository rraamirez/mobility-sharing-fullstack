import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Travel } from "../models/domain.models";

export type TravelPayload = {
  driver: { id: number | undefined };
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: number;
};

@Injectable({ providedIn: "root" })
export class TravelService {
  private readonly apiUrl = `${environment.apiUrl}/travel`;

  constructor(private readonly http: HttpClient) {}

  search(origin: string, destination?: string): Observable<Travel[][]> {
    let params = new HttpParams().set("origin", origin);
    if (destination) {
      params = params.set("destination", destination);
    }
    return this.http.get<Travel[][]>(`${this.apiUrl}/origin-destination`, { params });
  }

  byDriver(driverId: number): Observable<Travel[]> {
    return this.http.get<Travel[]>(`${this.apiUrl}/driver/${driverId}`);
  }

  enrolled(userId: number): Observable<Travel[]> {
    return this.http.get<Travel[]>(`${this.apiUrl}/enrolled/${userId}`);
  }

  unrated(userId: number): Observable<Travel[]> {
    return this.http.get<Travel[]>(`${this.apiUrl}/unratedTravels/${userId}`);
  }

  create(travel: TravelPayload): Observable<Travel> {
    return this.http.post<Travel>(`${this.apiUrl}/`, travel);
  }

  createRecurrent(travels: TravelPayload[]): Observable<Travel[]> {
    return this.http.post<Travel[]>(`${this.apiUrl}/recurrent-travel`, travels);
  }

  cancel(id: number): Observable<Travel> {
    return this.http.put<Travel>(`${this.apiUrl}/cancel-travel/${id}`, {});
  }

  complete(id: number): Observable<Travel> {
    return this.http.put<Travel>(`${this.apiUrl}/complete-travel/${id}`, {});
  }
}
