import Identifier from "./Identifier";

class Char {
  position;
  siteId;
  value;

  constructor(value: string, siteId: string, identifiers: number[]) {
    this.position = identifiers;
    this.siteId = siteId;
    this.value = value;
  }
}

export default Char;
