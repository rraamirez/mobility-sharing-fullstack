import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { UserTravel } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class UserTravelService {
  private readonly apiUrl = `${environment.apiUrl}/user-travel`;

  constructor(private readonly http: HttpClient) {}

  book(travelId: number, userId: number): Observable<UserTravel> {
    return this.http.post<UserTravel>(`${this.apiUrl}/`, {
      id: 0,
      user: { id: userId },
      travel: { id: travelId },
      status: "pending"
    });
  }

  accept(travelId: number, userId: number): Observable<UserTravel> {
    return this.http.put<UserTravel>(`${this.apiUrl}/accept/${travelId}/${userId}`, {});
  }

  reject(travelId: number, userId: number): Observable<UserTravel> {
    return this.http.put<UserTravel>(`${this.apiUrl}/reject/${travelId}/${userId}`, {});
  }

  byTravel(travelId: number): Observable<UserTravel[]> {
    return this.http.get<UserTravel[]>(`${this.apiUrl}/travel/${travelId}`);
  }
}
