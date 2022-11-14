import {Component, HostListener, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EventService} from "./service/event.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnDestroy {

  constructor() {}

  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    // if (this.gameId !== null) {
    //   let promises = [];
    //   promises.push(
    //     await this.http.put(this.connectionUrl + 'games/' + this.gameId, null)
    //       .subscribe(_ => {})
    //   )
    //   promises.push(
    //     await this.stompClient.send(this.appPrefix + '/' + this.gameId.trim(), {}, JSON.stringify({
    //       surrenders: this.playerNo
    //     }))
    //   )
    //   await Promise.all(promises);
    // }
  }


  getBackgroundColor(playerNo: number): string {
    if (playerNo == 1) return 'red';
    if (playerNo == 2) return 'yellow';
    return 'white';
  }

}
