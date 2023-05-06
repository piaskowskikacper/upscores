import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Match } from '../match';
import { MatchService } from '../match.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit{

  public matches: Match[];
  public teamsList : String[] = [];
  public table : [any][any];

  constructor(private matchService: MatchService, private cd: ChangeDetectorRef){ 

  }


    public getTable(): void {
    this.matchService.getTable("Bundesliga").subscribe(
      (response: Match[]) => {
        this.matches = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

    public createTeamsList(): void{
      this.matches.forEach(match => {
        if (!this.teamsList.includes(match.home_team)) {
          this.teamsList.push(match.home_team);
        }
      });
      console.log(this.teamsList)
    }


    // public calculateTable(): void{
    //   this.matches.forEach(element => {
        
    //   });
    // }



  ngOnInit(): void {
    this.getTable();
    this.createTeamsList();
    this.cd.detectChanges();
  }

}
