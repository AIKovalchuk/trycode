import Char from "./Char";
import Identifier from "./Identifier";

class CRDT {
  siteId: string;
  struct: any;

  constructor(id: string) {
    this.siteId = id;
    this.struct = [];
  }

  public localInsert(value: string, index: number) {
    const char = this.generateChar(value, index);
    this.struct.slice(index, 0, char);

    return char;
  }

  public localDelete(idx) {
    return this.struct.splice(idx, 1)[0];
  }

  private generateChar(val: string, index: number) {
    const posBefore =
      (this.struct[index - 1] && this.struct[index - 1].position) || [];
    const posAfter = (this.struct[index] && this.struct[index].position) || [];
    const newPos = this.generatePosBetween(posBefore, posAfter);

    return new Char();
  }

  private generatePosBetween(
    pos1: Identifier[],
    pos2: Identifier[],
    newPos: Identifier[] = []
  ) {
    const id1: Identifier = pos1[0];
    const id2: Identifier = pos2[0];

    if (id2.digit - id1.digit > 1) {
      const newDigit = this.generateIdBetween(id1.digit, id2.digit);
      newPos.push(new Identifier(newDigit, this.siteId));
      return newPos;
    } else if (id2.digit - id1.digit === 1) {
      newPos.push(id1);
      return this.generatePosBetween(pos1.slice(1), pos2, newPos);
    }
  }

  private generateIdBetween(pos1: number, pos2: number) {}
}

export default CRDT;
