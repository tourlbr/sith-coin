import { parseISO } from "date-fns";
import { format as dateFnsTZFormat, utcToZonedTime } from "date-fns-tz";
import { ISO_FORMAT, ISO_GENESIS, TIMEZONE } from "../enums/blockChain.enum";

import { Block } from "./block";
import { Transaction } from "./transaction";

export class BlockChain {
  public chain: Block[];
  public difficulty: number;
  public pendingTransactions: Transaction[];
  public miningReward: number;

  constructor(difficulty: number, miningReward: number) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty || 2;
    this.pendingTransactions = [];
    this.miningReward = miningReward || 100;
  }

  private createGenesisBlock(): Block {
    return new Block(
      this.formatTimestamp(ISO_GENESIS, ISO_FORMAT, TIMEZONE),
      [new Transaction("Genesis Block", "Ajunta Pall", 666)],
      "933cf6a7e43745deb888fd04689eb1e9"
    )
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length -1];
  }

  // public addBlock(newBlock: Block): void {
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   newBlock.mineBlock(this.difficulty);

  //   this.chain.push(newBlock);
  // }

  public minePendingTransactions(miningRewardAddress: string): void {
    const block = new Block(
      this.formatTimestamp(new Date().toISOString(), ISO_FORMAT, TIMEZONE),
      this.pendingTransactions
    );

    block.mineBlock(this.difficulty);

    console.log(`Block successfully mined!`);
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  public createTransaction(transaction: Transaction): void {
    this.pendingTransactions.push(transaction);
  }

  public getBalanceOfAddress(address: string): number {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }

        if(transaction.toAddress === address) {
          balance += transaction.amount
        }
      }
    }

    return balance;
  }

  public isValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  private formatTimestamp(iso: string, format: string, timeZone: string): string {
    return dateFnsTZFormat(
      utcToZonedTime(
        parseISO(iso),
        timeZone,
      ),
      format,
      { timeZone }
    );
  }
}
