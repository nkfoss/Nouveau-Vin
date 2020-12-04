import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { HomeComponent } from './home/home.component';
import { CategoryItemComponent } from './review-list/category-item/category-item.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ReviewListComponent,
    HomeComponent,
    CategoryItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
