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
  listItems: BrowseItem[] | Review[];

  constructor(private dataService: DataService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.browsingCriteria = this.activatedRoute.snapshot.paramMap.get('browsingCriteria')
    this.dataService.fetchCriteria(this.browsingCriteria).subscribe(
      (fetched: BrowseItem[] | Review[]) => {
        console.log("Fetch successful;")
        this.listItems = fetched;
      },
      (error) => {
        console.log(error);
        this.listItems = [];
      }
    )
  }


}
