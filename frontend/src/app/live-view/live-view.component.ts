import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Match } from '../match';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatchService } from '../match.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css']
})
export class LiveViewComponent implements OnInit{
  public matches: Match[];


  constructor(private matchService: MatchService, private cd: ChangeDetectorRef, private ngZone: NgZone){ 

  }


  public getLiveMatches(): void {
    this.matchService.getLiveMatches().subscribe(
      (response: Match[]) => {
        this.matches = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public interval =  setInterval( () => {
    this.getLiveMatches();
    }, 30000);


  ngOnInit(): void {
    this.getLiveMatches();
    this.interval;
    this.cd.detectChanges();
  }

  ngOnDestroy(): void{
    clearInterval(this.interval)
  }
}
