import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BrowseItem, DataService, Review } from '../data.service';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {

  browsingCriteria: string
  browseItems: BrowseItem[];

  constructor(private dataService: DataService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(routeParams => {
      this.browsingCriteria = routeParams['browsingCriteria'];
      this.dataService.fetchBrowseItems(this.browsingCriteria).subscribe(
        (fetched: BrowseItem[]) => {
          console.log("Fetch successful;")
          this.browseItems = fetched;
        },
        (error) => {
          console.log(error);
          this.browseItems = [];
        }
      )
    })
    // this.activatedRoute.snapshot.paramMap.get('browsingCriteria')
    // this.dataService.fetchBrowseItems(this.browsingCriteria).subscribe(
    //   (fetched: BrowseItem[]) => {
    //     console.log("Fetch successful;")
    //     this.browseItems = fetched;
    //   },
    //   (error) => {
    //     console.log(error);
    //     this.browseItems = [];
    //   }
    // )
  }


}
