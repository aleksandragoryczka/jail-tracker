import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './home/feature/login/login.component';
import { NgModule } from '@angular/core';
import { RequestsComponent } from './jail/feature/requests/requests.component';
import { CalendarComponent } from './jail/feature/calendar/calendar.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'requests', component: RequestsComponent },
  { path: 'new-request', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
