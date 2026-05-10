import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Rating } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class RatingService {
  private readonly apiUrl = `${environment.apiUrl}/rating`;

  constructor(private readonly http: HttpClient) {}

  create(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(`${this.apiUrl}/`, rating);
  }

  byRatedUser(userId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/rated-user/${userId}`);
  }

  byRatingUser(userId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/rating-user/${userId}`);
  }
}
