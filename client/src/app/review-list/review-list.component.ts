import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, UrlSegment } from "@angular/router";
import { DataService } from "../data.service";
import { BrowseItem } from "../shared/browseitem.model";

@Component({
  selector: "app-review-list",
  templateUrl: "./review-list.component.html",
  styleUrls: ["./review-list.component.css"],
})
export class ReviewListComponent implements OnInit {
  
  // Criteria is variety, country, or taster. The array is the list of all countries, tasters, and SOME varieties.
  browseItems: BrowseItem[];
  browsingCriteria: string;
  heading: string;
  subheading: string;

  // In the long-view, we display ALL varieties (not the browse-items).
  longView = false;
  fullList: BrowseItem[];

  constructor(
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  // Setup the router subscription and update criteria list.
  ngOnInit() {
    this.activatedRoute.url.subscribe((segments: UrlSegment[]) => {
      this.browsingCriteria = segments[1].path;
      this.longView = false; // Reset the view on update.
      this.setHeadings(segments[1].path); // segments[1] is the Browsing criteria

      this.dataService.fetchBrowseItems(segments[1].path).subscribe( 
        (fetched: any[]) => { this.sortCriteria(fetched[0]) }, // The first item is the array of our data. The second item is metadata.
        (error) => { this.browseItems = []; }
      );
    });
  }

  // Sets the main/sub headings, dependent on the browsing criteria (segmentPath).
  setHeadings(segmentPath: string): void {
    this.heading = segmentPath.toUpperCase();
    switch(segmentPath) {
      case 'countries':
        this.subheading = "Browse wines from a particular country"
        break;
      case 'varieties':
        this.subheading = "Browse wines a particular variety"
        break;
      case 'critics':
        this.subheading = "Browse wines reviewed by a particular critic"
        break;
    }
  }

  /**
   * Partitions the fetch BrowseItems into an array for the main view,
   * and the full array for the alternate view. Main array length = 20.
   */
  sortCriteria(fetched: BrowseItem[]) {
    this.fullList = fetched.slice();
    fetched.sort((a,b) => (a.numReviews > b.numReviews) ? -1 : 1 );
    this.browseItems = fetched.slice(0,20);
    this.browseItems.sort((a,b) => (a.value > b.value) ? 1 : -1);
  }

  /**
   * Navigate to view the wine reviews, based on the chosen criteria. 
   * @param chosenCriteria : The specific country, variety, or critic to browse by.
   */
  onChooseCriteria(chosenCriteria: string) {
    this.router.navigate([chosenCriteria], { relativeTo: this.activatedRoute });
  }
}
