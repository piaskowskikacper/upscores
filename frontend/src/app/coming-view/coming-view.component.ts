import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Match } from '../match';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatchService } from '../match.service';
import { AppComponent } from '../app.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-coming-view',
  templateUrl: './coming-view.component.html',
  styleUrls: ['./coming-view.component.css']
})
export class ComingViewComponent implements OnInit{

  public matches: Match[];
  public favMatches: Match[];

  constructor(private matchService: MatchService, private cd: ChangeDetectorRef, public _authService: AuthService){ 

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
    this.getFavouriteMatches();
    this.getComingMatches();
    this.cd.detectChanges();
  }

}
