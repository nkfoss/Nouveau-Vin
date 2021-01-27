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
    return this.http.get(`${this.apiUrl}/fetchRandoms`, {
      responseType: "json",
    });
  }

  /**
   * Gets a count of reviews matching search term, then uses
   * the count to get the correct number of reviews (for page 1)
   * @param searchTerm 
   */
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

  /**
   * Gets a certain number of reviews for the page number entered.
   * Triggers the sub to send out the reviews, current/max pages, and a header containing the search term. 
   * @param searchTerm The seach term to use.
   * @param targetPage The page number. It's used as a multiplier for determining where to start and end the count of reviews.
   */
  getSearchedReviews(searchTerm: string, targetPage: number) {
    this.http
      .get(
        `${this.apiUrl}/reviews?searchTerm=${searchTerm}&page=${targetPage}`,
        { responseType: "json" }
      )
      .subscribe((response: any[]) => {
        this.selectedReviewsSub.next({
          currPage: targetPage,
          maxPages: Math.ceil( response[1][0].found_rows / 18),
          selectedReviews: response[0],
          message: `Showing results for: "${searchTerm}" `,
        });
      });
  }

  /**
   * Used for getting a count of reviews matching an instance of search criteria.
   * @param browsingCriteria 'Country', 'variety', or 'taster'.
   * @param selectedCriteria The specific country, variety, or taster.
   */
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

  /**
   * Used for getting a certain count/page number of reviews.
   * @param browsingCriteria 
   * @param chosenCriteria 
   * @param targetPage 
   */
  getSelectedReviews(browsingCriteria: string, chosenCriteria: string, targetPage: number) {
    this.http
      .get(
        `${this.apiUrl}/reviews?browsingCriteria=${browsingCriteria}&selectedCriteria=${chosenCriteria}&page=${targetPage}`
      )
      .subscribe((response: any[]) => {
        this.selectedReviewsSub.next({
          currPage: targetPage,
          maxPages: Math.ceil( response[1][0].found_rows / 18 ),
          selectedReviews: response[0]
        });
      });
  }

  calcMaxPages(count: number): number {
    return Math.ceil(count / 18);
  }
}
