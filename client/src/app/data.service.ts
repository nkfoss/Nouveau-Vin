import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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

  // httpOptions: { headers: HttpHeaders } = {
  //   headers: new HttpHeaders({ "Content-Type": "application/json" })
  // }

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
    )
  }

}
