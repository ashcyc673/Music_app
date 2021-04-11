import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = {
    userName: "",
    password: "",
    _id: null
  };

  warning = "";
  loading = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.user = new User();
  }
  
  onSubmit(f: NgForm) {
    if(this.user.userName !== "" && this.user.password !== "") {
      this.auth.login(this.user).subscribe(message => {
        localStorage.setItem("access_token", message.token);
        this.router.navigate(['/newReleases'],{});
      }, err => {
        this.warning = err.error.message;
        this.loading = false;
      })
    }
  }
}
