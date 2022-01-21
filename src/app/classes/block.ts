import * as sha256 from 'crypto-js/sha256';

export class Block {
  public hash: string;

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
  }

  public calculateHash(): string {
    return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}
