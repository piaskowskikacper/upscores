import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchPreviewComponent } from './match-preview/match-preview.component';
import { AppComponent } from './app.component';
import { MainViewComponent } from './main-view/main-view.component';
import { FinishedViewComponent } from './finished-view/finished-view.component';
import { ComingViewComponent } from './coming-view/coming-view.component';
import { LiveViewComponent } from './live-view/live-view.component';
import { DatepickerViewComponent } from './datepicker-view/datepicker-view.component';
import { TableViewComponent } from './table-view/table-view.component';
import { RegistrationViewComponent } from './registration-view/registration-view.component';
import { LoginViewComponent } from './login-view/login-view.component';
import { AuthGuard } from './auth.guard';
import { FavouriteViewComponent } from './favourite-view/favourite-view.component';

const routes: Routes = [
  {path: 'scores', component: MainViewComponent},
  {path: 'scores/favourite', component: FavouriteViewComponent, canActivate: [AuthGuard]},
  {path: 'scores/live', component: LiveViewComponent},
  {path: 'scores/coming', component: ComingViewComponent},
  {path: 'scores/finished', component: FinishedViewComponent},
  {path: 'scores/:date', component: DatepickerViewComponent},
  {path: 'scores/preview/:id', component: MatchPreviewComponent},
  {path: 'scores/preview/:league/table', component: TableViewComponent},
  {path: 'register', component: RegistrationViewComponent},
  {path: 'login', component: LoginViewComponent},
  {path: '', redirectTo: 'scores', pathMatch: 'full'},
  {path: '**', redirectTo: 'scores', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
