import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Match {
  matchId: number;
  player1Email: string;
  player2Email: string;
}

class Participant {

}

@Injectable()
export class TournamentService {
  private _participants: Participant[] = [];

  constructor(private _http: HttpClient) { }

  getPlayableMatches(tournamentId: string): Observable<Match[]> {
    const url = 'https://matchplay.events/data/tournaments/' + tournamentId + '/results';
    return this._http.get<Array<any>>(url).map(
      rounds => {
        const matches: Match[] = [];
        for (let i = 0; i < rounds.length; i++) {
          for (let j = 0; j < rounds[i].games.length; j++) {
            const game = rounds[i].games[j];
            if (game.status !== 'completed') {
              matches.push({ matchId: game.game_id, player1Email: game.players[0].name, player2Email: game.players[1].name });
            }
          }
        }
        return matches;
      }
    );
  }
}

