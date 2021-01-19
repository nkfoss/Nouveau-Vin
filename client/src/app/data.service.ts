import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { ErrorHandlerService } from "./error.service";
import { BrowseItem } from "./shared/browseitem.model";
import { ReviewItem } from "./shared/reviewitem.model";

@Injectable({
  providedIn: "root",
})
export class DataService {
  maxPages: number;
  apiUrl: string = environment.apiUrl;
  selectedReviewsSub = new Subject<any>();

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) {}

  /**
   * A decoy login function. Used for recording hack attempts.
   * @param username 
   * @param password 
   */
  login(username: string, password: string) {
    return this.http.post(
      `${this.apiUrl}/login`,
      {
        username: username,
        password: password,
      },
      { responseType: "json" }
    );
  }

  fetchBrowseItems(browsingCriteria: string): Observable<BrowseItem[]> {
    return this.http.get<BrowseItem[]>(`${this.apiUrl}/${browsingCriteria}`, {
      responseType: "json",
    });
  }

  /**
   * *** DEPRECATED *** : used for fetching full list of varieties
   */
  fetchAllVarieties(): Observable<BrowseItem[]> {
    return this.http.get<BrowseItem[]>(`${this.apiUrl}/variety/all`, {
      responseType: "json",
    });
  }

  /**
   * Get the random reviews for the home page.
   */
  fetchRandoms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/countReviews`, {
      responseType: "json",
    });
  }

  countSearchedReviews(searchTerm: string) {
    this.http
      .get(`${this.apiUrl}/count?searchTerm=${searchTerm}`, {
        responseType: "json",
      })
      .subscribe((data) => {
        this.maxPages = this.calcMaxPages(data[0].count);
        this.getSearchedReviews(searchTerm, 1);
      });
  }

  getSearchedReviews(searchTerm: string, targetPage: number) {
    this.http
      .get(
        `${this.apiUrl}/reviews?searchTerm=${searchTerm}&page=${targetPage}`,
        { responseType: "json" }
      )
      .subscribe((reviews: ReviewItem[]) => {
        console.log("sending out sub");
        this.selectedReviewsSub.next({
          currPage: targetPage,
          maxPages: this.maxPages,
          selectedReviews: reviews,
          message: `Showing results for: "${searchTerm}" `,
        });
      });
  }

  countSelectedReviews(browsingCriteria: string, selectedCriteria: string) {
    this.http
      .get(
        `${this.apiUrl}/count?browsingCriteria=${browsingCriteria}&selectedCriteria=${selectedCriteria}`,
        { responseType: "json" }
      )
      .subscribe((data) => {
        this.maxPages = this.calcMaxPages(data[0].count);
        this.getSelectedReviews(browsingCriteria, selectedCriteria, 1);
      });
  }

  getSelectedReviews(browsingCriteria: string, chosenCriteria: string, targetPage: number) {
    this.http
      .get(
        `${this.apiUrl}/reviews?browsingCriteria=${browsingCriteria}&selectedCriteria=${chosenCriteria}&page=${targetPage}`
      )
      .subscribe((reviews: ReviewItem[]) => {
        this.selectedReviewsSub.next({
          currPage: targetPage,
          maxPages: this.maxPages,
          selectedReviews: reviews,
        });
      });
  }

  calcMaxPages(count: number): number {
    return Math.ceil(count / 18);
  }
}
