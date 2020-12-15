import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  errorMessage: string = '';

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  onLogin() {
    this.dataService.login(this.username, this.password).subscribe(
      (results: any) => {
        console.log('response arrived')
      },
      (error: Error) => {
        console.log(error);
        this.errorMessage = error.error.message;
      }
    )
  }
}
