import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { addCircleOutline, carOutline, personCircleOutline, searchOutline, starOutline } from "ionicons/icons";
import { I18nService } from "../../core/i18n/i18n.service";

@Component({
  selector: "app-tabs",
  standalone: true,
  imports: [RouterLink, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs],
  template: `
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="search" routerLink="/app/search">
          <ion-icon name="search-outline"></ion-icon>
          <ion-label>{{ i18n.t("tabs.search") }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="trips" routerLink="/app/trips">
          <ion-icon name="car-outline"></ion-icon>
          <ion-label>{{ i18n.t("tabs.trips") }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="publish" routerLink="/app/publish">
          <ion-icon name="add-circle-outline"></ion-icon>
          <ion-label>{{ i18n.t("tabs.publish") }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="ratings" routerLink="/app/ratings">
          <ion-icon name="star-outline"></ion-icon>
          <ion-label>{{ i18n.t("tabs.ratings") }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="profile" routerLink="/app/profile">
          <ion-icon name="person-circle-outline"></ion-icon>
          <ion-label>{{ i18n.t("tabs.profile") }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `
})
export class TabsPage {
  constructor(readonly i18n: I18nService) {
    addIcons({ searchOutline, carOutline, addCircleOutline, starOutline, personCircleOutline });
  }
}
