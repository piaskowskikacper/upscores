import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Match } from './match';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatchService } from './match.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  public matches: Match[];
  public date = new FormControl();
  public dateString : String;
  url: string;
     
  constructor( private matchService: MatchService, private cd: ChangeDetectorRef, private datepipe: DatePipe, private router: Router, public _authService: AuthService){ 

  }

  callDateComponent(): void{
    this.dateString = (this.datepipe.transform(this.date.value, 'yyyy-MM-dd'))!.toString();
    this.router.navigate(['/scores/',this.dateString]);
    const url = '/scores/'+this.dateString;
    window.location.replace(url)
  }


  ngOnInit(): void {
    this.date.valueChanges.subscribe(
      (response: any[]) => {
            this.callDateComponent();
          },)
    this.cd.detectChanges();

    // setInterval(function () {
    //   window.location.reload();
    // }, 5000);

  }
  
}
