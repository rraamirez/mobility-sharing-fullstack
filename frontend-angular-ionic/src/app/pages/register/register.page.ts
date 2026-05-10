import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText
} from "@ionic/angular/standalone";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonSpinner,
    IonText
  ],
  template: `
    <ion-content>
      <main class="auth-shell">
        <ion-card>
          <ion-card-content class="stack">
            <h1>Create Account</h1>
            <ion-item>
              <ion-label position="stacked">Name</ion-label>
              <ion-input [(ngModel)]="form.name"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input [(ngModel)]="form.email" type="email"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Username</ion-label>
              <ion-input [(ngModel)]="form.username"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Password</ion-label>
              <ion-input [(ngModel)]="form.password" type="password"></ion-input>
            </ion-item>
            <ion-button expand="block" (click)="submit()" [disabled]="loading || !isValid">
              <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
              <span *ngIf="!loading">Register</span>
            </ion-button>
            <ion-text color="danger" *ngIf="error">{{ error }}</ion-text>
            <ion-button fill="clear" routerLink="/login">I already have an account</ion-button>
          </ion-card-content>
        </ion-card>
      </main>
    </ion-content>
  `,
  styles: [`
    .auth-shell {
      min-height: 100%;
      display: grid;
      place-items: center;
      padding: 28px;
    }

    ion-card {
      width: min(460px, 100%);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    h1 {
      margin: 0;
      font-size: 28px;
    }
  `]
})
export class RegisterPage {
  form = {
    name: "",
    email: "",
    username: "",
    password: ""
  };
  loading = false;
  error = "";

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  get isValid(): boolean {
    return Object.values(this.form).every((value) => value.trim().length > 0);
  }

  submit(): void {
    this.error = "";
    this.loading = true;
    this.authService.register(this.form).subscribe({
      next: () => void this.router.navigateByUrl("/app/search"),
      error: () => {
        this.error = "Account creation failed. Try another username or email.";
        this.loading = false;
      }
    });
  }
}
