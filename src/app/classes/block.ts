import * as sha256 from 'crypto-js/sha256';

import { Transaction } from './transaction';

export class Block {
  public hash: string;
  public nonce: number;

  constructor(
    public timestamp: string,
    public transactions: Transaction[],
    public previousHash: string = ""
  ) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;

    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  public calculateHash(): string {
    return sha256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  public mineBlock(difficulty: number): void {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++
      this.hash = this.calculateHash();
    }

    console.log(`Block mined: ${this.hash}`);
  }

  public hasValidTransactions(): boolean {
    for (const transaction of this.transactions) {
      if (!transaction.isValid()) {
        return false;
      }
    }

    return true;
  }
}
