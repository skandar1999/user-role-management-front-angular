import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ListeUsersComponent } from './components/liste-users/liste-users.component';

const routes: Routes = [
  { path: '', component: AddUserComponent },
  { path: 'adduser', component: AddUserComponent },
  { path: 'users', component: ListeUsersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
