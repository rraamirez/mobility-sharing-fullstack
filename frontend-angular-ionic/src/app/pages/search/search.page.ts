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
import { I18nService } from "../../core/i18n/i18n.service";
import { LanguageSelectorComponent } from "../../core/i18n/language-selector.component";
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
    IonToolbar,
    LanguageSelectorComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title class="toolbar-title">{{ i18n.t("search.title") }}</ion-title>
        <app-language-selector slot="end"></app-language-selector>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <main class="page-shell stack">
        <ion-card>
          <ion-card-content class="split-grid">
            <ion-item>
              <ion-label position="stacked">{{ i18n.t("search.origin") }}</ion-label>
              <ion-input [(ngModel)]="origin" placeholder="Granada"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">{{ i18n.t("search.destination") }}</ion-label>
              <ion-input [(ngModel)]="destination"></ion-input>
            </ion-item>
            <ion-button expand="block" (click)="search()" [disabled]="loading || !origin.trim()">
              <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
              <span *ngIf="!loading">{{ i18n.t("search.search") }}</span>
            </ion-button>
          </ion-card-content>
        </ion-card>

        <p class="muted" *ngIf="!loading && groups.length === 0">{{ i18n.t("search.noResults") }}</p>

        <ion-list>
          <ion-card class="trip-card" *ngFor="let group of groups">
            <ion-card-header>
              <ion-card-title>{{ group[0].origin }} -> {{ group[0].destination }}</ion-card-title>
              <p class="muted">
                {{ i18n.t("search.driver") }}: {{ group[0].driver.name || group[0].driver.username }}
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
                  <ion-button fill="solid" (click)="book(travel)">{{ i18n.t("search.book") }}</ion-button>
                </ion-buttons>
              </article>
              <ion-button fill="outline" (click)="bookAll(group)" *ngIf="group.length > 1">
                {{ i18n.t("search.bookFullGroup") }}
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
    private readonly alertController: AlertController,
    readonly i18n: I18nService
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
        await this.showMessage(this.i18n.t("search.loadFailed"));
      }
    });
  }

  async book(travel: Travel): Promise<void> {
    if (!this.user) {
      await this.showMessage(this.i18n.t("search.userLoadFailed"));
      return;
    }

    if (travel.price > this.user.rupeeWallet) {
      await this.showMessage(this.i18n.t("search.insufficientBalance"));
      return;
    }

    this.userTravelService.book(travel.id, this.user.id).subscribe({
      next: () => void this.showMessage(this.i18n.t("search.requestSent")),
      error: () => void this.showMessage(this.i18n.t("search.bookFailed"))
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
