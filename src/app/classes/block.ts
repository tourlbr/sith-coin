import * as sha256 from 'crypto-js/sha256';

export class Block {
  public hash: string;
  public nonce: number;

  constructor(
    public index: number,
    public timestamp: string,
    public data: any,
    public previousHash: string = ''
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;

    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  public calculateHash(): string {
    return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  public mineBlock(difficulty: number) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("$")) {
      this.nonce++
      this.hash = this.calculateHash();
    }

    console.log(`Block mined: ${this.hash}`);
  }
}
