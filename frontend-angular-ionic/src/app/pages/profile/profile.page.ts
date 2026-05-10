import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import { User, WeeklyEnvironmentalStats } from "../../core/models/domain.models";
import { AuthService } from "../../core/services/auth.service";
import { UserService } from "../../core/services/user.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonTitle,
    IonToolbar
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title class="toolbar-title">Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <main class="page-shell split-grid">
        <ion-card *ngIf="user">
          <ion-card-content class="stack">
            <h2>{{ user.username }}</h2>
            <p class="pill">{{ user.ecoRank?.name || "EcoRank pendiente" }}</p>
            <ion-item>
              <ion-label position="stacked">Name</ion-label>
              <ion-input [(ngModel)]="form.name"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input [(ngModel)]="form.email"></ion-input>
            </ion-item>
            <ion-button expand="block" (click)="save()">Save Changes</ion-button>
            <ion-button expand="block" color="danger" fill="outline" (click)="logout()">Sign Out</ion-button>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-content class="stack">
            <h2>Weekly Impact</h2>
            <pre>{{ stats | json }}</pre>
          </ion-card-content>
        </ion-card>
      </main>
    </ion-content>
  `,
  styles: [`
    pre {
      white-space: pre-wrap;
      color: #cbd5df;
      font-family: inherit;
      margin: 0;
    }
  `]
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  stats: WeeklyEnvironmentalStats | null = null;
  form = {
    name: "",
    email: ""
  };

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.load();
    this.userService.weeklyEnvironmentalStats().subscribe({
      next: (stats) => (this.stats = stats),
      error: () => (this.stats = null)
    });
  }

  load(): void {
    this.userService.me().subscribe((user) => {
      this.user = user;
      this.form = { name: user.name, email: user.email };
    });
  }

  save(): void {
    if (!this.user) {
      return;
    }

    this.userService.update({ ...this.user, ...this.form }).subscribe({
      next: async () => {
        await this.showMessage("Profile updated.");
        this.load();
      },
      error: () => void this.showMessage("The profile could not be saved.")
    });
  }

  logout(): void {
    this.authService.logout();
  }

  private async showMessage(message: string): Promise<void> {
    const alert = await this.alertController.create({ header: "Profile", message, buttons: ["OK"] });
    await alert.present();
  }
}
