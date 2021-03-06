import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { DataService } from "../data.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})

//=============================================================================================================
export class HomeComponent implements OnInit, OnDestroy {
  loadingStatus: string = "Loading...";

  browsingCriteria: string;
  chosenCriteria: string;

  reviewItems = [];
  selectedReviews = [];

  heading: string = "Nouveau Wine Reviews";
  subheading: string = "Browse professional wine reviews.";
  location: string;
  currPage: number;
  maxPages: number;

  selectedReviewsSub: Subscription;

  //==============================================================================================================
  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  // First, set up sub to receive selected reviews and page number.
  // Second, look at route parameters and call a Data-Service method dependent on those parameters.
  ngOnInit() {
    this.onSelectedReviewsUpdated();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.handleNewParams(params);
    });
  }

  /**
   * Actions to take when an update is received from selected reviews sub: 
   * 1.) Set the current and max pages (received from sub)... 2.) Handle the received reviews... 3.) Set subheading (if there is a message)
   */
  private onSelectedReviewsUpdated() {
    this.selectedReviewsSub = this.dataService.selectedReviewsSub.subscribe(
      (data) => {
        this.currPage = data.currPage;
        this.maxPages = data.maxPages;

        if (data.selectedReviews.length === 0) { this.loadingStatus = "No results to show"; } 
        else { this.selectedReviews = data.selectedReviews; }

        if (data.message) { this.subheading = data.message;}
      }
    );
  }

  /**
   * Take action on the route updating (depending on how it updates).
   * @param params The params object received from the activated route.
   */
  private handleNewParams(params: Params) {

    if (params["browsingCriteria"]) {               // Case 1: Fetch specifc reviews.

      if (params["browsingCriteria"] === "search") { // Case 1a: Fetch reviews by a search term.
        this.selectedReviews = [];
        this.loadingStatus = "Loading...";
        this.heading = params["chosenCriteria"];
        this.subheading = `Searching for '${this.heading}'...`;
        this.dataService.getSearchedReviews( params["chosenCriteria" ], 1);
      } 

      else {                                        // Case 1b: Fetch by browsing criteria
        this.browsingCriteria = params["browsingCriteria"];
        this.chosenCriteria = params["chosenCriteria"];
        this.setHeadings();
        this.dataService.getSelectedReviews( params["browsingCriteria"], params["chosenCriteria"], 1 );
      }
    }

    else {                                            // Case 2: Fetch random reviews
      this.dataService.fetchRandoms().subscribe(
        (reviews: any) => { this.selectedReviews = reviews[0]; },
        (error) => { console.log(error);}
      );
    }
  }

  /**
   * Set custom heading appropriate for taster, country, or variety.
   */
  private setHeadings() {
    this.heading = this.chosenCriteria.toUpperCase();
    if (this.browsingCriteria === "country") { this.subheading = `Browse reviews for wines from ${this.chosenCriteria}`;} 
    else if (this.browsingCriteria === "variety") { this.subheading = `Browse reviews for ${this.chosenCriteria}`; } 
    else if (this.browsingCriteria === "critic") { this.subheading = `Browse wines reviewed by ${this.chosenCriteria}`; }
  }

  ngOnDestroy() {
    if (this.selectedReviewsSub) { this.selectedReviewsSub.unsubscribe(); }
  }

  //==========================================================================================================================================

  /**
   * 
   * @param reviewItem The iterable in the template
   * This is used to make sure we don't have a location like 'Spain, Spain'. Instead it just gives the country.
   */
  getLocationHeading(reviewItem): string {
    if (reviewItem.province === reviewItem.country) { return reviewItem.country; } 
    else { return `${reviewItem.province}, ${reviewItem.country}`; }
  }

  roundDecimal(price: number): number { 
    return Math.round(price); 
  }

  onNavigateTwitter(handle: string): void {
    handle = handle.replace("@", "");
    let url = "http://www.twitter.com/" + handle;
    window.open(url, "_blank");
  }

  onBrowseCritic(name: string) { this.router.navigate(["critic/" + name]); }

  previousClass(): string {
    if (this.currPage > 1) { return "page-item"; }
    else { return "page-item disabled"; }
  }

  nextClass(): string {
    if (this.currPage != this.maxPages) { return "page-item"; } 
    else { return "page-item disabled"; }
  }

  changePage(change: number) {
    if (this.activatedRoute.snapshot.params["browsingCriteria"] === "search") {
      // chosenCriteria is the 'searchTerm'
      this.dataService.getSearchedReviews(
        this.activatedRoute.snapshot.params["chosenCriteria"],
        this.currPage + change
      );
    } else {
      this.dataService.getSelectedReviews(
        this.browsingCriteria,
        this.chosenCriteria,
        this.currPage + change
      );
    }
  }
}
