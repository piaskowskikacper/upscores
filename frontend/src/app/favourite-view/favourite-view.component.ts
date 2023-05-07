import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Match } from '../match';
import { HttpErrorResponse } from '@angular/common/http';
import { MatchService } from '../match.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favourite-view',
  templateUrl: './favourite-view.component.html',
  styleUrls: ['./favourite-view.component.css']
})
export class FavouriteViewComponent implements OnInit{

  public matches: Match[];


  constructor(private matchService: MatchService, private cd: ChangeDetectorRef, private router: Router){ 

  }

  public unmarkAsFavourite(_id : String): void{
    this.matchService.unmarkAsFavourite(_id)
      .subscribe(
        res => {
          console.log(res)
          window.location.reload()
        },
        err => console.log(err)
      )
  }

    public getFavouriteMatches(): void {
    this.matchService.getFavouriteMatches().subscribe(
      (response: Match[]) => {
        this.matches = response;
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['/login'])
        }
      }
    )
  }


  ngOnInit(): void {
    this.getFavouriteMatches();
    this.cd.detectChanges();
  }


}
