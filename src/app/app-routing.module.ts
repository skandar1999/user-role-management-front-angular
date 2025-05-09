import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './components/add-user/add-user.component';
import { RoleManagementComponent } from './components/role-management/role-management/role-management.component';
import { HistoriqueListComponent } from './components/historique-list/historique-list.component';

const routes: Routes = [
  { path: '', component: AddUserComponent },
  { path: 'adduser', component: AddUserComponent },
  { path: 'role', component: RoleManagementComponent },
  { path: 'historique', component: HistoriqueListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
