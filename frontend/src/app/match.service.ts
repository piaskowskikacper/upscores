import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from './match';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiServerUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  public getMatch(id : string): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiServerUrl}/matches/${id}`)
  }

  public getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiServerUrl}/matches/`)
  }

  public getTable(league : string): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiServerUrl}/matches/${league}/table`)
  }
  
  public getDatePickedMatches(date : string): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiServerUrl}/matches/date/${date}`)
  }

  public getLiveMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiServerUrl}/matches/live`)
  }

  public getFinishedMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiServerUrl}/matches/finished`)
  }

  public getComingMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiServerUrl}/matches/coming`)
  }

  public getFavouriteMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiServerUrl}/matches/favourite`)
  }

}
