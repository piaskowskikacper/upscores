import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration-view',
  templateUrl: './registration-view.component.html',
  styleUrls: ['./registration-view.component.css']
})
export class RegistrationViewComponent implements OnInit{

  registerUserData = {email: '', password: ''}
  constructor(){}

  registerUser(){
    console.log(this.registerUserData)
  }


  ngOnInit(){

  }
}
