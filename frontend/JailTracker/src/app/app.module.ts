import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import {LoginComponent} from './home/feature/login/login.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AppRoutingModule} from './app-routing';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import {NgbModalModule, NgbModule, NgbTooltipModule,} from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from './home/feature/navigation/navigation.component';
import { MatIconModule } from '@angular/material/icon';
import { RequestsComponent } from './jail/feature/requests/requests.component';
import { CalendarComponent } from './jail/feature/calendar/calendar.component';
import { PopupWithInputsComponent } from './shared/ui/popup-with-inputs/popup-with-inputs.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedTableComponent } from './shared/ui/shared-table/shared-table.component';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    NavigationComponent,
    AppComponent,
    LoginComponent,
    RequestsComponent,
    CalendarComponent,
    PopupWithInputsComponent,
    SharedTableComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    MatIconModule,
    // NgbTooltipModule,
    NgbModule,
    // BrowserAnimationsModule,
    MatIconModule,
    // MatSelectModule,
    // MatCheckboxModule,
    // MatOptionModule,
    MatDialogModule,
    // CommonModule,
    // NgbModalModule,
    MatDatepickerModule,
    // MatCommonModule,
    MatNativeDateModule,
    // MatInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.allowedDomains],
        disallowedRoutes: [],
      },
    }),
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DatePipe,
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function tokenGetter() {
  return localStorage.getItem('access_token');
}
