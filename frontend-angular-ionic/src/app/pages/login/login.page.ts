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
  selector: "app-login",
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
        <section>
          <p class="eyebrow">Mobility Sharing</p>
          <h1>Comparte trayectos con una experiencia web lista para entregar.</h1>
          <p class="muted">Frontend Ionic + Angular conectado al backend Spring Boot y MySQL dockerizados.</p>
        </section>

        <ion-card>
          <ion-card-content class="stack">
            <h2>Entrar</h2>
            <ion-item>
              <ion-label position="stacked">Usuario</ion-label>
              <ion-input [(ngModel)]="username" autocomplete="username"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Contrasena</ion-label>
              <ion-input [(ngModel)]="password" type="password" autocomplete="current-password"></ion-input>
            </ion-item>
            <ion-button expand="block" (click)="submit()" [disabled]="loading">
              <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
              <span *ngIf="!loading">Entrar</span>
            </ion-button>
            <ion-text color="danger" *ngIf="error">{{ error }}</ion-text>
            <ion-button fill="clear" routerLink="/register">Crear cuenta</ion-button>
          </ion-card-content>
        </ion-card>
      </main>
    </ion-content>
  `,
  styles: [`
    .auth-shell {
      min-height: 100%;
      display: grid;
      align-items: center;
      grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
      gap: 28px;
      width: min(1040px, 100%);
      margin: 0 auto;
      padding: 28px;
    }

    h1 {
      max-width: 680px;
      margin: 0;
      font-size: clamp(32px, 6vw, 64px);
      line-height: 0.98;
      letter-spacing: 0;
    }

    h2 {
      margin: 0;
      font-size: 24px;
    }

    .eyebrow {
      color: #65e2a8;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0;
    }

    ion-card {
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    @media (max-width: 760px) {
      .auth-shell {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LoginPage {
  username = "";
  password = "";
  loading = false;
  error = "";

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    this.error = "";
    this.loading = true;
    this.authService.login(this.username.trim(), this.password).subscribe({
      next: () => void this.router.navigateByUrl("/app/search"),
      error: () => {
        this.error = "No se pudo iniciar sesion. Revisa usuario y contrasena.";
        this.loading = false;
      }
    });
  }
}
