import { Routes } from "@angular/router";
import { authGuard } from "./core/services/auth.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "login",
    loadComponent: () => import("./pages/login/login.page").then((m) => m.LoginPage)
  },
  {
    path: "register",
    loadComponent: () => import("./pages/register/register.page").then((m) => m.RegisterPage)
  },
  {
    path: "app",
    canActivate: [authGuard],
    loadComponent: () => import("./pages/tabs/tabs.page").then((m) => m.TabsPage),
    children: [
      {
        path: "search",
        loadComponent: () => import("./pages/search/search.page").then((m) => m.SearchPage)
      },
      {
        path: "trips",
        loadComponent: () => import("./pages/trips/trips.page").then((m) => m.TripsPage)
      },
      {
        path: "publish",
        loadComponent: () => import("./pages/publish/publish.page").then((m) => m.PublishPage)
      },
      {
        path: "ratings",
        loadComponent: () => import("./pages/ratings/ratings.page").then((m) => m.RatingsPage)
      },
      {
        path: "profile",
        loadComponent: () => import("./pages/profile/profile.page").then((m) => m.ProfilePage)
      },
      {
        path: "",
        redirectTo: "search",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "**",
    redirectTo: "login"
  }
];
