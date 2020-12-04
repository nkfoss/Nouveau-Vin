import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Country, DataService, User } from '../data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
  }

  /**
   * Navigating to countries will create the Review-List component. During init, this component will ask the Data Service for a list of countries.
   * Once fetched, those countries will populate the 'list' on the template.
   */
  onNavigateCountries(): void {
    this.router.navigate(['/countries'])
  }

  onPostUser(): void {
    this.dataService.postUser(this.dataService.user)
  }

}
