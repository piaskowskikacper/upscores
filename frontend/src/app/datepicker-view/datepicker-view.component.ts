import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Match } from '../match';
import { MatchService } from '../match.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-datepicker-view',
  templateUrl: './datepicker-view.component.html',
  styleUrls: ['./datepicker-view.component.css']
})
export class DatepickerViewComponent implements OnInit{
  public date : any;
  public matches: Match[];
  public favMatches: Match[];

  constructor(private activatedRoute: ActivatedRoute, private matchService: MatchService, private cd: ChangeDetectorRef, public _authService: AuthService){ 

  }


  public getFavouriteMatches(): void {
    this.matchService.getFavouriteMatches().subscribe(
      (response: Match[]) => {
        this.favMatches = response;
        
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log(error)
        }
      }
    )
  }

  public checkIfFavourite(id: any): Boolean{
    var check = false;
    this.favMatches?.forEach(element => {
      if (element._id === id)  {
        console.log(element._id)
        check = true;
      }  
    });

    if (check){
      return true
    }
    else {
      return false
    }
  }


  public markAsFavourite(_id : String): void{
    this.matchService.markAsFavourite(_id)
      .subscribe(
        res => {
          console.log(res)
          window.location.reload()
        },
        err => console.log(err)
      )
  }


  public getDate(): void{
    this.date = this.activatedRoute.snapshot.paramMap.get('date');
    // this.ngOnInit();
  }


  public getDatePickedMatches(date : string): void {
    this.matchService.getDatePickedMatches(date).subscribe(
      (response: Match[]) => {
        this.matches = response;
        // this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  ngOnInit(): void {

    const subject = new BehaviorSubject(this.date);
    subject.subscribe(
      console.log);

    this.getFavouriteMatches();
    this.getDate();
    this.getDatePickedMatches(this.date);
    this.cd.detectChanges();
  }

}
