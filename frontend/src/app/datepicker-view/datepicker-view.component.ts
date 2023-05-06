import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Match } from '../match';
import { MatchService } from '../match.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

@Component({
  selector: 'app-datepicker-view',
  templateUrl: './datepicker-view.component.html',
  styleUrls: ['./datepicker-view.component.css']
})
export class DatepickerViewComponent implements OnInit{
  public date : any;
  public matches: Match[];

  constructor(private activatedRoute: ActivatedRoute, private matchService: MatchService, private cd: ChangeDetectorRef){ 

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

    this.getDate();
    this.getDatePickedMatches(this.date);
    this.cd.detectChanges();
  }

}
