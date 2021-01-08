import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReviewListComponent } from './review-list/review-list.component';


const routes: Routes = [
  {path: 'nouveau', component: HomeComponent},
  {path: 'nouveau/home', redirectTo: 'nouveau', pathMatch: 'full'},
  {path: 'nouveau/about', component: AboutComponent},
  {path: 'nouveau/login', component: LoginComponent},
  {path: 'nouveau/variety/all', component: ReviewListComponent},
  
  {path: 'nouveau/:browsingCriteria', component: ReviewListComponent},
  {path: 'nouveau/:browsingCriteria/all', component: ReviewListComponent},
  {path: 'nouveau/:browsingCriteria/:chosenCriteria', component: HomeComponent},
];


// ==============================================================

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
