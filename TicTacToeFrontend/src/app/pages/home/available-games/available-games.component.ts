import {Component, Input} from '@angular/core';
import {ConnectionService} from "../../../service/connection.service";

@Component({
  selector: 'app-available-games',
  templateUrl: './available-games.component.html',
  styleUrls: ['./available-games.component.css']
})
export class AvailableGamesComponent {

  @Input()
  games: string[];

  constructor(private connection: ConnectionService) { }

  async joinGameAndRedirect(gameId: string) {
    await this.connection.joinGameAndRedirect(gameId);
  }

}
