import { Injectable } from '@angular/core';
import * as EC from 'elliptic';
import { Block } from '../classes/block';

import { BlockChain } from '../classes/blockchain';
import { Transaction } from '../classes/transaction';
import { WalletKey } from '../types/general.type';

@Injectable({
  providedIn: 'root'
})
export class BlockChainService {
  public blockChainInstance = new BlockChain(2, 100);
  public walletKeys: Array<WalletKey> = [];

  constructor() {
    this.blockChainInstance.difficulty = 1;
    this.blockChainInstance.minePendingTransactions("Exegol");
    this.generateWalletKeys();
  }

  public getBlocks(): Block[] {
    return this.blockChainInstance.chain;
  }

  minePendingTransactions() {
    this.blockChainInstance.minePendingTransactions(
      this.walletKeys[0].publicKey
    );
  }

  addressIsFromCurrentUser(address: string | null): boolean {
    return address === this.walletKeys[0].publicKey;
  }

  generateWalletKeys() {
    const ec = new EC.ec('secp256k1');
    const key = ec.genKeyPair();

    this.walletKeys.push({
      key,
      publicKey: key.getPublic('hex'),
      privateKey: key.getPrivate('hex'),
    });

    console.log(this.walletKeys);
  }

  getPendingTransactions() {
    return this.blockChainInstance.pendingTransactions;
  }

  addTransaction(transaction: Transaction) {
    this.blockChainInstance.addTransaction(transaction);
  }
}

