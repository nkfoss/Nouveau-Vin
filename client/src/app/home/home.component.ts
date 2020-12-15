import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

//=============================================================================================================
export class HomeComponent implements OnInit, OnDestroy {

  loadingStatus: string = 'Loading...';

  browsingCriteria: string;
  chosenCriteria: string;

  reviewItems = [];
  selectedReviews = [];

  heading: string = "Bootleg Wine Reviews";
  subheading: string = "Simply the best.";
  location: string;
  page: number;

  searchSub: Subscription;
  //==============================================================================================================
  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.setupSearchSub();
    this.activatedRoute.params.subscribe((params: Params) => { this.handleNewParams(params) })
  }

  private handleNewParams(params: Params) {
    // In this case, we have some kind of category of reviews
    if (params['browsingCriteria']) {
      if (params['browsingCriteria'] === "search") { // Categorized by search term
        console.log('searching')
        let searchTerm = params['chosenCriteria'];
        this.heading = searchTerm;
        this.dataService.searchReviews(searchTerm);
      }
      else {  // Variety or country or taster category
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
    }
    // In this case, we were just loading the homepage with random reviews
    else {
      this.dataService.fetchRandoms().subscribe(
        (reviews: any) => { this.selectedReviews = reviews; },
        (error) => { console.log(error) }
      );
    }
  }

  private setupSearchSub() {
    this.searchSub = this.dataService.reviewSubject.subscribe(
      (data) => {
        this.subheading = "Showing results for: '" + data.searchTerm + "'";
        if (data.reviews.length > 0) {
          console.log(data.reviews)
          this.reviewItems = data.reviews
          this.page = 1;
          this.selectReviews(1);
        }
        else {
          this.selectedReviews = [];
          this.loadingStatus = "No results to show."
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

  ngOnDestroy() {
    if (this.searchSub) { this.searchSub.unsubscribe() }
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
    this.router.navigate(['critic/' + name])
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


