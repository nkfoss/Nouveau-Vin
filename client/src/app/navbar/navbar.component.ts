import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { DataService, User } from '../data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
  }

  onNavigate(target: string): void {
    this.dataService.onNavigate(target)
      .subscribe(
        (userList: User[]) => {
          console.log(userList[0].name)
        },
        error => {
          console.log(error)
        })
  }

  onPostUser(): void {
    this.dataService.postUser(this.dataService.user)
  }

}
