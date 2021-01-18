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
  longView = false;
  browsingCriteria: string;
  browseItems: BrowseItem[];

  constructor(
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.url.subscribe((segments: UrlSegment[]) => {
      this.browsingCriteria = segments[1].path;
      this.dataService.fetchBrowseItems(this.browsingCriteria).subscribe(
        (fetched: BrowseItem[]) => { this.browseItems = fetched; },
        (error) => { this.browseItems = []; }
      );
    });
  }

  onChooseCriteria(index: number) {
    let chosenCriteria = this.browseItems[index].value;
    this.router.navigate([chosenCriteria], { relativeTo: this.activatedRoute });
  }
}
