import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './home/feature/login/login.component';
import {NgModule} from '@angular/core';
import { DashboardComponent } from './home/feature/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
];

// const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   { path: '', component: LoginComponent },
//   { path: 'dashboard', component: DashboardComponent },
//   {
//     path: '',
//     //canActivate: [authGuard],
//     children: [
//       // {
//       //   path: 'panel-control',
//       //   component: AdminPanelComponent,
//       //   canActivate: [adminGuard],
//       // },
//       // {
//       //   path: 'profile',
//       //   component: ProfileComponent,
//       // },
//       // {
//       //   path: 'prisoners',
//       //   component: PrisonersComponent,
//       //   canActivate: [supervisorGuard],
//       // },
//       // {
//       //   path: 'calendar',
//       //   component: CalendarComponent,
//       //   canActivate: [supervisorGuard],
//       // },
//       // {
//       //   path: 'dashboard',
//       //   component: DashboardComponent
//       // }
//     ],
//   },

//   //{ path: '**', component: PageNotFoundComponent },
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
