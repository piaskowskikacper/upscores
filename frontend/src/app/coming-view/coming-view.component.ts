import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Match } from '../match';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatchService } from '../match.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-coming-view',
  templateUrl: './coming-view.component.html',
  styleUrls: ['./coming-view.component.css']
})
export class ComingViewComponent implements OnInit{

  public matches: Match[];


  constructor(private matchService: MatchService, private cd: ChangeDetectorRef, private ngZone: NgZone){ 

  }


    public getComingMatches(): void {
    this.matchService.getComingMatches().subscribe(
      (response: Match[]) => {
        this.matches = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }


  ngOnInit(): void {
    this.getComingMatches();
    this.cd.detectChanges();
  }

}
