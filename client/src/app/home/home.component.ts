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

  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {

        if (params['browsingCriteria']) {
          this.browsingCriteria = params['browsingCriteria'];
          this.chosenCriteria = params['chosenCriteria'];
          this.dataService.fetchReviewItems(this.browsingCriteria, this.chosenCriteria).subscribe(
            (reviews: any) => { console.log(reviews) },
            (error) => { console.log(error) } 
          )
        }

        else {
          // Load the regular home page.
          console.log("we are home")
        }
      }
    )

       // console.log("segment change")
      // this.browsingCriteria = segments[0].path;
      // if (segments.length === 2) {
      //   this.chosenCriteria = segments[1].path;
      // }
      // this.dataService.fetchReviewItems(this.browsingCriteria, this.chosenCriteria).subscribe(
      //   (reviews: any) => {
      //      console.log(reviews)
      //   },
      //   (error) => {
      //     console.log(error)
      //   } 
      // )
    // this.activatedRoute.params.subscribe(routeParams => {

    //   this.browsingCriteria = routeParams['browsingCriteria'];
    //   if (this.browsingCriteria) {

    //   }
    // })
  }

  initSpecificReviews() {

    // this.dataService.fetchReviewItems(this.browsingCriteria).subscribe(
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
