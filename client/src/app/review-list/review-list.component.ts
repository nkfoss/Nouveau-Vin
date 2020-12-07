import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { BrowseItem, DataService } from '../data.service';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {

  longView = false;
  browsingCriteria: string
  browseItems: BrowseItem[];

  constructor(private dataService: DataService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe((segments: UrlSegment[]) => {
      this.browsingCriteria = segments[0].path

      if (segments.length === 2) {
        this.longView = true;
        this.dataService.fetchAllVarieties().subscribe(
          (fetched: BrowseItem[]) => {
            console.log("Fetch successful;")
            this.browseItems = fetched;
          }, (error) => {
            console.log(error);
            this.browseItems = [];
          }
        ) 
      } else {
        this.dataService.fetchBrowseItems(this.browsingCriteria).subscribe(
          (fetched: BrowseItem[]) => {
            console.log("Fetch successful;")
            this.browseItems = fetched;
          }, (error) => {
            console.log(error);
            this.browseItems = [];
          }
        )
      }
    })
  }

  onChooseCriteria(index: number) {
    let chosenCriteria = this.browseItems[index].value;
    this.router.navigate([chosenCriteria], { relativeTo: this.activatedRoute })
  }


}
