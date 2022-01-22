
import { Block } from "./block";
import { Transaction } from "./transaction";
import { ISO_FORMAT, ISO_GENESIS, TIMEZONE } from "../enums/general.enum";
import { formatTimestamp } from "../utils/formatTimestamp";

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
      formatTimestamp(ISO_GENESIS, ISO_FORMAT, TIMEZONE),
      [],
      "0"
    )
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length -1];
  }

  public minePendingTransactions(miningRewardAddress: string): void {
    const rewardTransaction = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTransaction);

    const block = new Block(
      formatTimestamp(new Date().toISOString(), ISO_FORMAT, TIMEZONE),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);

    console.log(`Block successfully mined!`);
    this.chain.push(block);
    this.pendingTransactions = [];
  }

  public addTransaction(transaction: Transaction): void {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address');
    }

    // Verify the transactiion
    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to chain');
    }

    if (transaction.amount <= 0) {
      throw new Error('Transaction amount should be higher than 0');
    }

    // Making sure that the amount sent is not greater than existing balance
    if (this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount) {
      throw new Error('Not enough balance');
    }

    this.pendingTransactions.push(transaction);
    console.log(`transaction added: ${transaction}`);
  }

  public getBalanceOfAddress(address: string): number {
    let balance = 666;

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

    console.log(`Get Balance Address: ${balance}`);
    return balance;
  }

  public getAllTransactionsForWallet(address: string): Transaction[] {
    const transactions = [];

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address || transaction.toAddress === address) {
          transactions.push(transaction);
        }
      }
    }

    console.log(`get transactions for wallet count: ${transactions.length}`);
    return transactions;
  }

  public isChainValid() {
    // Check if the Genesis block hasn't been tampered with by comparing
    // the output of createGenesisBlock with the first block on our chain
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    // Check the remaining blocks on the chain to see if there hashes and
    // signatures are correct
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (previousBlock.hash !== currentBlock.previousHash) {
        return false;
      }

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
    }

    return true;
  }
}
