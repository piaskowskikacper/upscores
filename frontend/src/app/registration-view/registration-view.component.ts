import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-registration-view',
  templateUrl: './registration-view.component.html',
  styleUrls: ['./registration-view.component.css']
})
export class RegistrationViewComponent implements OnInit{

  registerUserData = {username: '', password: '', favourite: []}
  constructor(private _auth: AuthService, private router: Router){}

  registerUser(){
    this._auth.registerUser(this.registerUserData)
      .subscribe(
        res => {
          console.log(res)
          localStorage.setItem('token', res.token)
          this.router.navigate(['/scores/favourite'])
        },
        err => console.log(err)
      )
  }


  ngOnInit(){

  }
}
