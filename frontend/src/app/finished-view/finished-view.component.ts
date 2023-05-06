import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Match } from '../match';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatchService } from '../match.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-finished-view',
  templateUrl: './finished-view.component.html',
  styleUrls: ['./finished-view.component.css']
})
export class FinishedViewComponent implements OnInit{
  public matches: Match[];


  constructor(private matchService: MatchService, private cd: ChangeDetectorRef, private ngZone: NgZone){ 

  }


    public getFinishedMatches(): void {
    this.matchService.getFinishedMatches().subscribe(
      (response: Match[]) => {
        this.matches = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }


  ngOnInit(): void {
    this.getFinishedMatches();
    this.cd.detectChanges();
  }
}
