import { Injectable, signal } from "@angular/core";
import { Language, TranslationKey, translations } from "./translations";

const STORAGE_KEY = "mobility-sharing-language";

@Injectable({ providedIn: "root" })
export class I18nService {
  readonly language = signal<Language>(this.readInitialLanguage());

  setLanguage(language: Language): void {
    this.language.set(language);
    localStorage.setItem(STORAGE_KEY, language);
  }

  t(key: TranslationKey): string {
    return translations[this.language()][key] ?? translations.en[key];
  }

  private readInitialLanguage(): Language {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "es" || stored === "en" ? stored : "en";
  }
}
