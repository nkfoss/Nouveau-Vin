import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  browsingCriteria: string;
  chosenCriteria: string;

  reviewItems = [];

  heading: string = "Bootleg Wine Reviews";
  subheading: string = "Simply the best.";

  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {

        if (params['browsingCriteria']) {
          this.browsingCriteria = params['browsingCriteria'];
          this.chosenCriteria = params['chosenCriteria'];
          this.setHeadings();
          this.dataService.fetchReviewItems(this.browsingCriteria, this.chosenCriteria).subscribe(
            (reviews: any) => { this.reviewItems = reviews },
            (error) => { console.log(error) }
          )
        }

        else {
          // Load the regular home page.
          console.log("we are home")
        }
      }
    )
  }

  setHeadings() {
    this.heading = this.chosenCriteria.toUpperCase()
    if (this.browsingCriteria === "country") { this.subheading = `Browse reviews for wines from ${this.chosenCriteria}`; }
    else if (this.browsingCriteria === "variety") { this.subheading = `Browse reviews for ${this.chosenCriteria}`; }
    else if (this.browsingCriteria === "critic") { this.subheading = `Browse wines reviewd by ${this.chosenCriteria}`; }
    else { this.subheading = "Simply the Best." }
  }

}


