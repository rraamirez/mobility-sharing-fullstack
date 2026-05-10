import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(username: string, password: string): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(tap((response) => this.saveTokens(response)));
  }

  register(form: {
    name: string;
    email: string;
    username: string;
    password: string;
  }): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.apiUrl}/register`, { ...form, roleId: 2 })
      .pipe(tap((response) => this.saveTokens(response)));
  }

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    void this.router.navigateByUrl("/login");
  }

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem("access_token"));
  }

  private saveTokens(response: TokenResponse): void {
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);
  }
}
