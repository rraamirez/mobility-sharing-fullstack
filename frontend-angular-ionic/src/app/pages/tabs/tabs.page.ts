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
          <ion-label>Buscar</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="trips" routerLink="/app/trips">
          <ion-icon name="car-outline"></ion-icon>
          <ion-label>Viajes</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="publish" routerLink="/app/publish">
          <ion-icon name="add-circle-outline"></ion-icon>
          <ion-label>Publicar</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="ratings" routerLink="/app/ratings">
          <ion-icon name="star-outline"></ion-icon>
          <ion-label>Ratings</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="profile" routerLink="/app/profile">
          <ion-icon name="person-circle-outline"></ion-icon>
          <ion-label>Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `
})
export class TabsPage {
  constructor() {
    addIcons({ searchOutline, carOutline, addCircleOutline, starOutline, personCircleOutline });
  }
}
