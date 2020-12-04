import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Country, DataService } from '../data.service';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {

  countries: Country[];

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.dataService.onNavigateCountries().subscribe(
      (fetched: Country[]) => {
        console.log("Countries successfully fetched")
        this.countries = fetched;
      },
      error => {
        console.log(error);
        this.countries = [];
      }
    )
  }

  onChooseCountry(countryIndex: number) {
    
  }

}
