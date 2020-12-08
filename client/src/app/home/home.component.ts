import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

//=============================================================================================================
export class HomeComponent implements OnInit {

  browsingCriteria: string;
  chosenCriteria: string;

  reviewItems = [];
  selectedReviews = [];

  heading: string = "Bootleg Wine Reviews";
  subheading: string = "Simply the best.";
  location: string;
  page: number;
//==============================================================================================================
  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {

        if (params['browsingCriteria']) {
          this.browsingCriteria = params['browsingCriteria'];
          this.chosenCriteria = params['chosenCriteria'];
          this.setHeadings();
          this.dataService.fetchReviewItems(this.browsingCriteria, this.chosenCriteria).subscribe(
            (reviews: any) => {
              this.reviewItems = reviews;
              this.page = 1;
              this.selectReviews(this.page);
            },
            (error) => { console.log(error) }
          )
        }

        else {
          console.log("we are home");
          this.dataService.fetchRandoms().subscribe(
            (reviews: any) => { this.selectedReviews = reviews;},
            (error) => { console.log(error) }
          );
        }
      }
    )
  }

  private setHeadings() {
    this.heading = this.chosenCriteria.toUpperCase()
    if (this.browsingCriteria === "country") { this.subheading = `Browse reviews for wines from ${this.chosenCriteria}`; }
    else if (this.browsingCriteria === "variety") { this.subheading = `Browse reviews for ${this.chosenCriteria}`; }
    else if (this.browsingCriteria === "critic") { this.subheading = `Browse wines reviewd by ${this.chosenCriteria}`; }
  }

  private selectReviews(page: number) {
    let start = (page - 1) * 18;
    let end = (page * 18);
    this.selectedReviews = this.reviewItems.slice(start, end);
  }

//==========================================================================================================================================
  getLocationHeading(reviewItem): string {
    if (reviewItem.province === reviewItem.country) { return reviewItem.country }
    else {
      return `${reviewItem.province}, ${reviewItem.country}`
    }
  }

  roundDecimal(price: number): number {
    return Math.round(price)
  }

  onNavigateTwitter(handle: string): void {
    handle = handle.replace('@', '');
    let url = "http://www.twitter.com/" + handle;
    window.open(url, "_blank");
  }

  onBrowseCritic(name: string) {
    console.log('critic/' + name)
    this.router.
      navigate(['critic/' + name])
  }

  getMaxPages(): number {
    return Math.ceil(this.reviewItems.length / 18)
  }

  previousClass(): string {
    if (this.page > 1) { return "page-item" }
    else { return "page-item disabled" }
  }

  nextClass(): string {
    if (this.page != this.getMaxPages()) { return "page-item" }
    else { return "page-item disabled" }
  }

  changePage(change: number) {
    this.page = this.page + change;
    this.selectReviews(this.page);
  }
}


