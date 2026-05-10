import { Component } from "@angular/core";
import { IonSegment, IonSegmentButton } from "@ionic/angular/standalone";
import { I18nService } from "./i18n.service";
import { Language } from "./translations";

@Component({
  selector: "app-language-selector",
  standalone: true,
  imports: [IonSegment, IonSegmentButton],
  template: `
    <ion-segment
      class="language-selector"
      [value]="i18n.language()"
      (ionChange)="setLanguage($event.detail.value)"
    >
      <ion-segment-button value="en">EN</ion-segment-button>
      <ion-segment-button value="es">ES</ion-segment-button>
    </ion-segment>
  `,
  styles: [`
    .language-selector {
      width: 112px;
      margin-left: auto;
    }
  `]
})
export class LanguageSelectorComponent {
  constructor(readonly i18n: I18nService) {}

  setLanguage(value: unknown): void {
    if (value === "en" || value === "es") {
      this.i18n.setLanguage(value as Language);
    }
  }
}
