import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Match } from '../match';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatchService } from '../match.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit{
  public matches: Match[];
  public favId: any;

  constructor(private matchService: MatchService, private cd: ChangeDetectorRef, public _authService: AuthService){ 

  }

  public markAsFavourite(_id : String): void{
    this.matchService.markAsFavourite(_id)
      .subscribe(
        res => {
          console.log(res)
        },
        err => console.log(err)
      )
  }

  public getMatches(): void {
    this.matchService.getMatches().subscribe(
      (response: Match[]) => {
        this.matches = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public interval =  setInterval( () => {
    this.getMatches();
    }, 30000);

  ngOnInit(): void {
    this.getMatches();
    this.interval;
    this.cd.detectChanges();
  }

  ngOnDestroy(): void{

    clearInterval(this.interval)
  }

}
