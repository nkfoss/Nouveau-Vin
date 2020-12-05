import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReviewListComponent } from './review-list/review-list.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  
  {path: ':browsingCriteria', component: ReviewListComponent},
  {path: ':browsingCriteria/:chosenCriteria', component: HomeComponent},
];


// ==============================================================

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
