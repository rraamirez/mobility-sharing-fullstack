import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonRange,
  IonTextarea,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import { Rating, Travel, User } from "../../core/models/domain.models";
import { RatingService } from "../../core/services/rating.service";
import { TravelService } from "../../core/services/travel.service";
import { UserService } from "../../core/services/user.service";

@Component({
  selector: "app-ratings",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonRange,
    IonTextarea,
    IonTitle,
    IonToolbar
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title class="toolbar-title">Ratings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <main class="page-shell split-grid">
        <section class="stack">
          <h2>Trips Pending Rating</h2>
          <ion-card class="trip-card" *ngFor="let travel of unrated">
            <ion-card-header>
              <ion-card-title>{{ travel.origin }} -> {{ travel.destination }}</ion-card-title>
              <p class="muted">{{ travel.driver.username }} · {{ travel.date }}</p>
            </ion-card-header>
            <ion-card-content class="stack">
              <ion-item>
                <ion-label position="stacked">Rating: {{ form.rating }}</ion-label>
                <ion-range [(ngModel)]="form.rating" min="1" max="5" step="1" snaps="true"></ion-range>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Comment</ion-label>
                <ion-textarea [(ngModel)]="form.comment"></ion-textarea>
              </ion-item>
              <ion-button (click)="rate(travel)">Send Rating</ion-button>
            </ion-card-content>
          </ion-card>
          <p class="muted" *ngIf="unrated.length === 0">You have no trips pending rating.</p>
        </section>

        <section class="stack">
          <h2>Received</h2>
          <ion-card *ngFor="let rating of received">
            <ion-card-content>
              <strong>{{ rating.rating }}/5</strong>
              <p>{{ rating.comment || "No comment" }}</p>
            </ion-card-content>
          </ion-card>
        </section>
      </main>
    </ion-content>
  `
})
export class RatingsPage implements OnInit {
  user: User | null = null;
  unrated: Travel[] = [];
  received: Rating[] = [];
  form = {
    rating: 5,
    comment: ""
  };

  constructor(
    private readonly userService: UserService,
    private readonly travelService: TravelService,
    private readonly ratingService: RatingService,
    private readonly alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.userService.me().subscribe((user) => {
      this.user = user;
      this.refresh();
    });
  }

  refresh(): void {
    if (!this.user) {
      return;
    }
    this.travelService.unrated(this.user.id).subscribe((travels) => (this.unrated = travels));
    this.ratingService.byRatedUser(this.user.id).subscribe((ratings) => (this.received = ratings));
  }

  rate(travel: Travel): void {
    if (!this.user) {
      return;
    }

    this.ratingService.create({
      ratingUser: { id: this.user.id } as User,
      ratedUser: { id: travel.driver.id } as User,
      travel: { id: travel.id } as Travel,
      rating: Number(this.form.rating),
      comment: this.form.comment
    }).subscribe({
      next: async () => {
        this.form = { rating: 5, comment: "" };
        await this.showMessage("Rating sent.");
        this.refresh();
      },
      error: () => void this.showMessage("The rating could not be sent.")
    });
  }

  private async showMessage(message: string): Promise<void> {
    const alert = await this.alertController.create({ header: "Ratings", message, buttons: ["OK"] });
    await alert.present();
  }
}
