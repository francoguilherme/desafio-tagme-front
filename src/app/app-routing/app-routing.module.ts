import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../pages/login/login.component';
import { RecipesComponent } from '../pages/recipes/recipes.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'receitas', component: RecipesComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
