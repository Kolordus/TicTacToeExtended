import {Component, OnInit} from '@angular/core';
import {ConnectionService} from "../../service/connection.service";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  subscriptions = new Subscription();

  isUserNotConnected$ = this.connection.isUserNotConnected.asObservable();
  availableGames$: Observable<string[]> = this.connection.showOpenGames();

  constructor(private connection: ConnectionService) { }

  ngOnInit(): void {}

  async createGameAndConnect() {
    await this.connection.createGame();
  }


}


/*
TODO
teraz tak:

To musi być wszystko reaktywne.
Czyli to czy jest połączone też musi być ustawione tak by się odświeżało.
Obejrzec może jeszcze raz to o serwisach używającyh subjectów?
I wtedy zrobić to tak jak należy!
To będzie zrobione zaaaajeeeebiiiiśśśścieeee!!!
 */
