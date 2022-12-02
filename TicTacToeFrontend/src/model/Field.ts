export class Field {

  fieldNo: number;
  playerNo: number;
  currentNominal: number

  constructor(fieldNo: number, playerNo: number, currentNominal: number) {
    this.fieldNo = fieldNo;
    this.playerNo = playerNo;
    this.currentNominal = currentNominal;
  }
}
