import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import { Travel, User, UserTravel } from "../../core/models/domain.models";
import { TravelService } from "../../core/services/travel.service";
import { UserService } from "../../core/services/user.service";
import { UserTravelService } from "../../core/services/user-travel.service";

@Component({
  selector: "app-trips",
  standalone: true,
  imports: [
    CommonModule,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title class="toolbar-title">My Trips</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <main class="page-shell stack">
        <ion-segment [value]="mode" (ionChange)="setMode($event.detail.value)">
          <ion-segment-button value="driver">Published</ion-segment-button>
          <ion-segment-button value="enrolled">Booked</ion-segment-button>
        </ion-segment>

        <p class="muted" *ngIf="travels.length === 0">There are no trips in this view.</p>

        <ion-card class="trip-card" *ngFor="let travel of travels">
          <ion-card-header>
            <ion-card-title>{{ travel.origin }} -> {{ travel.destination }}</ion-card-title>
            <p class="muted">{{ travel.date }} · {{ travel.time }} · {{ travel.price }} rupees</p>
          </ion-card-header>
          <ion-card-content class="stack">
            <div>
              <ion-badge color="medium">{{ travel.status || "ACTIVE" }}</ion-badge>
              <ion-badge color="success" *ngIf="travel.environmentalActionLevel">
                {{ travel.environmentalActionLevel }}
              </ion-badge>
            </div>

            <div class="actions" *ngIf="mode === 'driver'">
              <ion-button fill="outline" color="warning" (click)="cancel(travel)">Cancel</ion-button>
              <ion-button fill="solid" color="success" (click)="complete(travel)">Complete</ion-button>
              <ion-button fill="clear" (click)="loadTravellers(travel)">Requests</ion-button>
            </div>

            <section *ngIf="selectedTravelId === travel.id" class="stack">
              <article class="traveller" *ngFor="let item of travellers">
                <span>{{ item.user.username }} · {{ item.status }}</span>
                <span>
                  <ion-button size="small" (click)="accept(travel.id, item.user.id)" *ngIf="item.status === 'pending'">
                    Accept
                  </ion-button>
                  <ion-button size="small" color="danger" fill="outline" (click)="reject(travel.id, item.user.id)" *ngIf="item.status === 'pending'">
                    Reject
                  </ion-button>
                </span>
              </article>
            </section>
          </ion-card-content>
        </ion-card>
      </main>
    </ion-content>
  `,
  styles: [`
    .actions,
    .traveller {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    ion-badge + ion-badge {
      margin-left: 8px;
    }
  `]
})
export class TripsPage implements OnInit {
  mode: "driver" | "enrolled" = "driver";
  user: User | null = null;
  travels: Travel[] = [];
  travellers: UserTravel[] = [];
  selectedTravelId: number | null = null;

  constructor(
    private readonly userService: UserService,
    private readonly travelService: TravelService,
    private readonly userTravelService: UserTravelService,
    private readonly alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.userService.me().subscribe((user) => {
      this.user = user;
      this.load();
    });
  }

  setMode(value: unknown): void {
    this.mode = value === "enrolled" ? "enrolled" : "driver";
    this.selectedTravelId = null;
    this.load();
  }

  load(): void {
    if (!this.user) {
      return;
    }

    const request = this.mode === "driver"
      ? this.travelService.byDriver(this.user.id)
      : this.travelService.enrolled(this.user.id);
    request.subscribe((travels) => (this.travels = travels));
  }

  cancel(travel: Travel): void {
    this.travelService.cancel(travel.id).subscribe({
      next: () => this.load(),
      error: () => void this.showMessage("The trip could not be canceled.")
    });
  }

  complete(travel: Travel): void {
    this.travelService.complete(travel.id).subscribe({
      next: () => this.load(),
      error: () => void this.showMessage("The trip could not be completed.")
    });
  }

  loadTravellers(travel: Travel): void {
    this.selectedTravelId = this.selectedTravelId === travel.id ? null : travel.id;
    if (this.selectedTravelId) {
      this.userTravelService.byTravel(travel.id).subscribe((items) => (this.travellers = items));
    }
  }

  accept(travelId: number, userId: number): void {
    this.userTravelService.accept(travelId, userId).subscribe(() => this.loadTravellers({ id: travelId } as Travel));
  }

  reject(travelId: number, userId: number): void {
    this.userTravelService.reject(travelId, userId).subscribe(() => this.loadTravellers({ id: travelId } as Travel));
  }

  private async showMessage(message: string): Promise<void> {
    const alert = await this.alertController.create({ header: "My Trips", message, buttons: ["OK"] });
    await alert.present();
  }
}
