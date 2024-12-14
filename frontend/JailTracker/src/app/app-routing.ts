import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './home/feature/login/login.component';
import { NgModule } from '@angular/core';
import { RequestsComponent } from './jail/feature/requests/requests.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'requests', component: RequestsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
