import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  searchTerm: string = '';

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
  }

  /**
   * Navigating will create the Review-List component. During init, this component will ask the Data Service for an array of objects matching the browsing criteria.
   * Once fetched, those countries will populate the 'list' on the template.
   * 
   * For example, if you selected 'country', the query will return a objects containing the criteria name (country) and the number of reviews (numReviews).
   */
  onNavigate(event: Event): void {
    let criteria = (<HTMLElement>event.target).textContent.toLowerCase();
    this.router.navigate([`/${criteria}`]);
  }

  onNavigateHome(): void {
    this.router.navigate(['home'])
  }

  onSearch() {
    console.log(this.searchTerm)
    this.dataService.searchReviews(this.searchTerm);
  }

}
