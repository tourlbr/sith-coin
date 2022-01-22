import { formatTimestamp } from './../utils/formatTimestamp';
import * as sha256 from 'crypto-js/sha256';
import * as EC from "elliptic";

import { KeyPair, Signature } from "../types/general.type";
import { ISO_FORMAT, TIMEZONE } from "../enums/general.enum";

const ec = new EC.ec("secp256k1");

export class Transaction {
  public signature: string | null = null;
  public timestamp: string;

  constructor(
    public fromAddress: string | null,
    public toAddress: string,
    public amount: number
  ) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = this.amount;
    this.timestamp = formatTimestamp(new Date(Date.now()).toISOString(), ISO_FORMAT, TIMEZONE);
  }

  public calculateHash(): string {
    return sha256(this.fromAddress + this.toAddress + this.amount + this.timestamp).toString();
  }

  public signTransaction(signingKey: KeyPair): void {
    // You can only send a transaction from the wallet that is linked to your
    // key. So here we check if the fromAddress matches your publicKey
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!");
    }

    // Calculate the hash of this transaction, sign it with the key
    // and store it inside the transaction object
    const hashTransaction: string = this.calculateHash();
    const sig: Signature = signingKey.sign(hashTransaction, "base64");

    this.signature = sig.toDER("hex");
  }

  public isValid(): boolean {
    // If the transaction doesn't have a from address we assume it's a
    // mining reward and that it's valid.
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction!");
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");

    return publicKey.verify(this.calculateHash(), this.signature);
  }
}
