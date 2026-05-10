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
import { I18nService } from "../../core/i18n/i18n.service";
import { LanguageSelectorComponent } from "../../core/i18n/language-selector.component";
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
    IonText,
    LanguageSelectorComponent
  ],
  template: `
    <ion-content>
      <main class="auth-shell">
        <ion-card>
          <ion-card-content class="stack">
            <app-language-selector></app-language-selector>
            <h1>{{ i18n.t("auth.createAccount") }}</h1>
            <ion-item>
              <ion-label position="stacked">{{ i18n.t("auth.name") }}</ion-label>
              <ion-input [(ngModel)]="form.name"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">{{ i18n.t("auth.email") }}</ion-label>
              <ion-input [(ngModel)]="form.email" type="email"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">{{ i18n.t("auth.username") }}</ion-label>
              <ion-input [(ngModel)]="form.username"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">{{ i18n.t("auth.password") }}</ion-label>
              <ion-input [(ngModel)]="form.password" type="password"></ion-input>
            </ion-item>
            <ion-button expand="block" (click)="submit()" [disabled]="loading || !isValid">
              <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
              <span *ngIf="!loading">{{ i18n.t("auth.register") }}</span>
            </ion-button>
            <ion-text color="danger" *ngIf="error">{{ error }}</ion-text>
            <ion-button fill="clear" routerLink="/login">{{ i18n.t("auth.alreadyHaveAccount") }}</ion-button>
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
    private readonly router: Router,
    readonly i18n: I18nService
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
        this.error = this.i18n.t("auth.registerFailed");
        this.loading = false;
      }
    });
  }
}
