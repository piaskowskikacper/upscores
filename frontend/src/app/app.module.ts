import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatDatepickerModule } from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatchPreviewComponent } from './match-preview/match-preview.component';
import { MainViewComponent } from './main-view/main-view.component';
import { FinishedViewComponent } from './finished-view/finished-view.component';
import { ComingViewComponent } from './coming-view/coming-view.component';
import { LiveViewComponent } from './live-view/live-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatepickerViewComponent } from './datepicker-view/datepicker-view.component';
import { DatePipe } from '@angular/common';
import { TableViewComponent } from './table-view/table-view.component';
import { RegistrationViewComponent } from './registration-view/registration-view.component';
import { LoginViewComponent } from './login-view/login-view.component'
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    MatchPreviewComponent,
    MainViewComponent,
    FinishedViewComponent,
    ComingViewComponent,
    LiveViewComponent,
    DatepickerViewComponent,
    TableViewComponent,
    RegistrationViewComponent,
    LoginViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [DatePipe, AuthService, AuthGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
