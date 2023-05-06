import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Match } from '../match';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../match.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-match-preview',
  templateUrl: './match-preview.component.html',
  styleUrls: ['./match-preview.component.css']
})
export class MatchPreviewComponent implements OnInit {

  public match: Match[];
  public match_id: any;
  routerOutletComponent: any;

  constructor(private activatedRoute: ActivatedRoute, private service: MatchService, private cd: ChangeDetectorRef){  }


  public getMatch(id : string): void {
    this.service.getMatch(id).subscribe(
      (response: Match[]) => {
        this.match = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public interval =  setInterval( () => {
    this.getMatch(this.match_id);
    }, 30000);



  ngOnInit(): void {
    this.match_id = this.activatedRoute.snapshot.paramMap.get('id');
    // this.match = this.service.getMatch(this.match_id)
    this.getMatch(this.match_id);
    this.interval;
    this.cd.detectChanges();
  }

  ngOnDestroy(): void{
    clearInterval(this.interval)
  }

}
