import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { ReviewItemComponent } from './review-list/review-item/review-item.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ReviewListComponent,
    ReviewItemComponent
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
