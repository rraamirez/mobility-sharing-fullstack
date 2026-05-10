import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  AlertController,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import { Travel, User } from "../../core/models/domain.models";
import { TravelService } from "../../core/services/travel.service";
import { UserService } from "../../core/services/user.service";
import { UserTravelService } from "../../core/services/user-travel.service";

@Component({
  selector: "app-search",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonSpinner,
    IonTitle,
    IonToolbar
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title class="toolbar-title">Buscar viaje</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <main class="page-shell stack">
        <ion-card>
          <ion-card-content class="split-grid">
            <ion-item>
              <ion-label position="stacked">Origen</ion-label>
              <ion-input [(ngModel)]="origin" placeholder="Granada"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Destino</ion-label>
              <ion-input [(ngModel)]="destination" placeholder="Opcional"></ion-input>
            </ion-item>
            <ion-button expand="block" (click)="search()" [disabled]="loading || !origin.trim()">
              <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
              <span *ngIf="!loading">Buscar</span>
            </ion-button>
          </ion-card-content>
        </ion-card>

        <p class="muted" *ngIf="!loading && groups.length === 0">No hay resultados todavia.</p>

        <ion-list>
          <ion-card class="trip-card" *ngFor="let group of groups">
            <ion-card-header>
              <ion-card-title>{{ group[0].origin }} -> {{ group[0].destination }}</ion-card-title>
              <p class="muted">
                Conductor: {{ group[0].driver.name || group[0].driver.username }}
                <span *ngIf="group[0].driver.rating"> · {{ group[0].driver.rating }}/5</span>
              </p>
            </ion-card-header>
            <ion-card-content class="stack">
              <article class="travel-row" *ngFor="let travel of group">
                <div>
                  <strong>{{ travel.date }} · {{ travel.time }}</strong>
                  <p class="muted">{{ travel.price }} rupees</p>
                  <ion-badge *ngIf="travel.environmentalActionLevel" color="success">
                    {{ travel.environmentalActionLevel }}
                  </ion-badge>
                </div>
                <ion-buttons>
                  <ion-button fill="solid" (click)="book(travel)">Reservar</ion-button>
                </ion-buttons>
              </article>
              <ion-button fill="outline" (click)="bookAll(group)" *ngIf="group.length > 1">
                Reservar grupo completo
              </ion-button>
            </ion-card-content>
          </ion-card>
        </ion-list>
      </main>
    </ion-content>
  `,
  styles: [`
    .travel-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .travel-row:first-child {
      border-top: 0;
    }

    @media (max-width: 640px) {
      .travel-row {
        align-items: stretch;
        flex-direction: column;
      }
    }
  `]
})
export class SearchPage implements OnInit {
  origin = "";
  destination = "";
  groups: Travel[][] = [];
  loading = false;
  user: User | null = null;

  constructor(
    private readonly travelService: TravelService,
    private readonly userService: UserService,
    private readonly userTravelService: UserTravelService,
    private readonly alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.userService.me().subscribe((user) => (this.user = user));
  }

  search(): void {
    this.loading = true;
    this.travelService.search(this.origin.trim(), this.destination.trim()).subscribe({
      next: (groups) => {
        this.groups = groups;
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        await this.showMessage("No se pudieron cargar viajes para esa busqueda.");
      }
    });
  }

  async book(travel: Travel): Promise<void> {
    if (!this.user) {
      await this.showMessage("No se pudo cargar tu usuario.");
      return;
    }

    if (travel.price > this.user.rupeeWallet) {
      await this.showMessage("Saldo insuficiente en la cartera.");
      return;
    }

    this.userTravelService.book(travel.id, this.user.id).subscribe({
      next: () => void this.showMessage("Solicitud enviada al conductor."),
      error: () => void this.showMessage("No se pudo reservar este viaje.")
    });
  }

  async bookAll(group: Travel[]): Promise<void> {
    for (const travel of group) {
      await this.book(travel);
    }
  }

  private async showMessage(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: "Mobility Sharing",
      message,
      buttons: ["OK"]
    });
    await alert.present();
  }
}
