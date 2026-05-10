import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { User, WeeklyEnvironmentalStats } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/mobility-sharing-user`;

  constructor(private readonly http: HttpClient) {}

  me(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  update(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/`, user);
  }

  weeklyEnvironmentalStats(): Observable<WeeklyEnvironmentalStats> {
    return this.http.get<WeeklyEnvironmentalStats>(`${this.apiUrl}/weekly-environmental-stats`);
  }
}
