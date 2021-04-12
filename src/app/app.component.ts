/************************************************************************ *********
* WEB422 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students. *
* Name: __Chiao-Ya Chang_ Student ID: __130402191__ Date: __April 10, 2021__ *
* Online Link: ____https://web422-sigma.vercel.app/login_______
* ********************************************************************************/

import { Component } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor (private router: Router, private auth: AuthService){}

  title = 'web422-a6';
  searchString: string;
  token : any;

  handleSearch(){
    this.router.navigate(['/search'],{queryParams: {q: this.searchString}});
    this.searchString = "";
  }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) { 
        this.token = this.auth.readToken();
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login'],{});
  }
}
