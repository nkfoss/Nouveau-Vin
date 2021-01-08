import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  searchTerm: string = '';
  qweSub: Subscription;

  constructor(private dataService: DataService, private router: Router, private activatedRoute: ActivatedRoute) { }

  /**
   * Navigating will create the Review-List component. During init, this component will ask the Data Service for an array of objects matching the browsing criteria.
   * Once fetched, those countries will populate the 'list' on the template.
   * 
   * For example, if you selected 'country', the query will return a objects containing the criteria name (country) and the number of reviews (numReviews).
   */
  onNavigate(event: Event): void {
    let criteria = (<HTMLElement>event.target).textContent.toLowerCase();
    this.router.navigate([`nouveau/${criteria}`]);
    console.log(this.activatedRoute);
  }

  onNavigateHome(): void {
    this.router.navigate(['nouveau/home'])
  }

  onSearch() {
    this.router.navigate([`nouveau/search/${this.searchTerm}`])
    this.searchTerm = '';
  }

}
