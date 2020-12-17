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

  qwe() {
    let bc = 'countries';
    let sc = 'armenia';
    this.http.get(`${this.apiUrl}/count?browsingCriteria=${bc}&selectedCriteria=${sc}`, { responseType: 'json'}).subscribe(
      (data) => {
        let count = data[0].count;
        this.asd(bc, sc, 1).subscribe(
          (reviews: ReviewItem[]) => {
            this.qweSub.next({
              currPage: 1,
              maxPage: this.getMaxPages(count),
              selectReviews: reviews
            });
          }
        );
      }
    );
  }

  asd(browsingCriteria: string, chosenCriteria: string, page: number) {
    return this.http.get(`${this.apiUrl}/reviews?browsingCriteria=${browsingCriteria}&selectedCriteria=${chosenCriteria}&page=${page}`)
  }

  getMaxPages(count: number): number {
    return Math.ceil(count / 18)
  }



}
