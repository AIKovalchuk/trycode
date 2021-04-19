class Char {
  position;
  counter;
  siteId;
  value;

  constructor(value: string, counter: any, siteId: string, identifiers) {
    this.position = identifiers;
    this.counter = counter;
    this.siteId = siteId;
    this.value = value;
  }
}

export default Char;
