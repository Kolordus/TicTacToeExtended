import {Component, Input, OnInit} from '@angular/core';
import {ConnectionService} from "../../service/connection.service";

@Component({
  selector: 'app-available-games',
  templateUrl: './available-games.component.html',
  styleUrls: ['./available-games.component.css']
})
export class AvailableGamesComponent {

  @Input()
  games: string[] | null;

  constructor(private connection: ConnectionService) { }

  async joinGame(gameId: string) {
    await this.connection.joinGame(gameId);
  }

}
