import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './error.service';
import { BrowseItem } from './shared/browseitem.model';
import { ReviewItem } from './shared/reviewitem.model';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  maxPages;
  apiUrl: string = environment.apiUrl;
  reviewSubject = new Subject<any>();

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  login(username: string, password: string) {
    return this.http
      .post(`${this.apiUrl}/login`,
        {
          username: username,
          password: password
        },
        { responseType: 'json' }
      );
  }

  fetchBrowseItems(browsingCriteria: string): Observable<BrowseItem[]> {
    return this.http
      .get<BrowseItem[]>(`${this.apiUrl}/${browsingCriteria}`, { responseType: "json" })
  }

  fetchReviewItems(browsingCriteria: string, selectedCritera: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/${browsingCriteria}/${selectedCritera}`, { responseType: 'json' })
  }

  fetchAllVarieties(): Observable<BrowseItem[]> {
    return this.http
      .get<BrowseItem[]>(`${this.apiUrl}/variety/all`, { responseType: 'json' })
  }

  fetchRandoms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/countReviews`, { responseType: 'json' })
  }

  searchReviews(searchTerm: string) {
    this.http.get<ReviewItem[]>(`${this.apiUrl}/search/${searchTerm}`, { responseType: 'json' }).subscribe(
      (reviews: ReviewItem[]) => {
        this.reviewSubject.next({
          reviews: reviews,
          searchTerm: searchTerm
        });
      }
    );
  }

  qweSub = new Subject<any>()

  qwe(browsingCriteria: string, selectedCriteria: string) {
    this.http.get(`${this.apiUrl}/count?browsingCriteria=${browsingCriteria}&selectedCriteria=${selectedCriteria}`, { responseType: 'json'}).subscribe(
      (data) => {
        this.maxPages = this.getMaxPages(data[0].count);
        this.getReviewsPage(browsingCriteria, selectedCriteria, 1);
      }
    );
  }

  getReviewsPage(browsingCriteria: string, chosenCriteria: string, targetPage: number) {
    this.http.get(`${this.apiUrl}/reviews?browsingCriteria=${browsingCriteria}&selectedCriteria=${chosenCriteria}&page=${targetPage}`).subscribe(
      (reviews: ReviewItem[]) => {
        console.log('sending out sub')
        this.qweSub.next({
          currPage: targetPage,
          maxPages: this.maxPages,
          selectedReviews: reviews
        });
      }
    )
  }

  getMaxPages(count: number): number {
    return Math.ceil(count / 18)
  }

}
