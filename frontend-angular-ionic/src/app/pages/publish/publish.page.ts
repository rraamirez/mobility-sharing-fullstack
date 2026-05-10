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
  IonSpinner,
  IonTitle,
  IonToggle,
  IonToolbar
} from "@ionic/angular/standalone";
import { Observable } from "rxjs";
import { User } from "../../core/models/domain.models";
import { TravelPayload, TravelService } from "../../core/services/travel.service";
import { UserService } from "../../core/services/user.service";

@Component({
  selector: "app-publish",
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
    IonSpinner,
    IonTitle,
    IonToggle,
    IonToolbar
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title class="toolbar-title">Publicar viaje</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <main class="page-shell">
        <ion-card>
          <ion-card-content class="stack">
            <div class="split-grid">
              <ion-item>
                <ion-label position="stacked">Origen</ion-label>
                <ion-input [(ngModel)]="form.origin"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Destino</ion-label>
                <ion-input [(ngModel)]="form.destination"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Precio</ion-label>
                <ion-input [(ngModel)]="form.price" type="number"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Fecha inicio</ion-label>
                <ion-input [(ngModel)]="form.startDate" type="date"></ion-input>
              </ion-item>
              <ion-item *ngIf="isRecurring">
                <ion-label position="stacked">Fecha fin</ion-label>
                <ion-input [(ngModel)]="form.endDate" type="date"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Hora</ion-label>
                <ion-input [(ngModel)]="form.time" type="time"></ion-input>
              </ion-item>
            </div>

            <ion-item>
              <ion-label>Viaje recurrente</ion-label>
              <ion-toggle [(ngModel)]="isRecurring"></ion-toggle>
            </ion-item>

            <ion-button expand="block" (click)="publish()" [disabled]="loading || !isValid">
              <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
              <span *ngIf="!loading">Publicar</span>
            </ion-button>
          </ion-card-content>
        </ion-card>
      </main>
    </ion-content>
  `
})
export class PublishPage implements OnInit {
  form = {
    origin: "",
    destination: "",
    price: 0,
    startDate: "",
    endDate: "",
    time: ""
  };
  isRecurring = false;
  loading = false;
  user: User | null = null;

  constructor(
    private readonly userService: UserService,
    private readonly travelService: TravelService,
    private readonly alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.userService.me().subscribe((user) => (this.user = user));
  }

  get isValid(): boolean {
    return Boolean(
      this.user &&
        this.form.origin &&
        this.form.destination &&
        this.form.price > 0 &&
        this.form.startDate &&
        this.form.time &&
        (!this.isRecurring || this.form.endDate)
    );
  }

  publish(): void {
    if (!this.user) {
      return;
    }

    this.loading = true;
    const dates = this.isRecurring
      ? this.dateRange(this.form.startDate, this.form.endDate)
      : [this.form.startDate];
    const payload: TravelPayload[] = dates.map((date) => ({
      driver: { id: this.user?.id },
      origin: this.form.origin,
      destination: this.form.destination,
      date,
      time: `${this.form.time}:00`,
      price: Number(this.form.price)
    }));
    const request: Observable<unknown> = this.isRecurring
      ? this.travelService.createRecurrent(payload)
      : this.travelService.create(payload[0]);

    request.subscribe({
      next: async () => {
        this.loading = false;
        await this.showMessage("Viaje publicado correctamente.");
        this.reset();
      },
      error: async () => {
        this.loading = false;
        await this.showMessage("No se pudo publicar el viaje.");
      }
    });
  }

  private dateRange(start: string, end: string): string[] {
    const dates: string[] = [];
    const current = new Date(`${start}T00:00:00`);
    const last = new Date(`${end}T00:00:00`);
    while (current <= last) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  private reset(): void {
    this.form = { origin: "", destination: "", price: 0, startDate: "", endDate: "", time: "" };
    this.isRecurring = false;
  }

  private async showMessage(message: string): Promise<void> {
    const alert = await this.alertController.create({ header: "Publicar viaje", message, buttons: ["OK"] });
    await alert.present();
  }
}
