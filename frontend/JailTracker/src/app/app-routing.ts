import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './home/feature/dashboard/dashboard.component';
import { LoginComponent } from './home/feature/login/login.component';
import { NgModule } from '@angular/core';
import { RequestsComponent } from './jail/feature/requests/requests.component';
import { CalendarComponent } from './jail/feature/calendar/calendar.component';
import { NewRequestComponent } from './jail/feature/new-request/new-request.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'requests', component: RequestsComponent },
  { path: 'new_request', component: NewRequestComponent },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
