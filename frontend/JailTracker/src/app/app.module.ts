import { NgModule } from '@angular/core';
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
import { DashboardComponent } from './home/feature/dashboard/dashboard.component';
import { DatePipe } from '@angular/common';
import { ErrorInterceptor } from './interceptor/error.interceptor';

@NgModule({
  declarations: [
    NavigationComponent,
    AppComponent,
    LoginComponent,
    DashboardComponent],
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
    // MatIconModule,
    // MatSelectModule,
    // MatCheckboxModule,
    // MatOptionModule,
    // MatDialogModule,
    // CommonModule,
    // NgbModalModule,
    // MatDatepickerModule,
    // MatCommonModule,
    // MatNativeDateModule,
    // MatInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
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
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function tokenGetter() {
  return localStorage.getItem('access_token');
}
