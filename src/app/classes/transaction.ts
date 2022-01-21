import { SHA256 } from "crypto-js";
import * as EC from "elliptic";

const ec = new EC.ec("secp256k1");

interface KeyPair extends EC.ec.KeyPair {};
interface Signature extends EC.ec.Signature {};

export class Transaction {
  public signature: string | null = null;

  constructor(
    public fromAddress: string | null,
    public toAddress: string,
    public amount: number
  ) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = this.amount;
  }

  public calculateHash(): string {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  public signTransaction(signingKey: KeyPair): void {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!");
    }

    const hashTx: string = this.calculateHash();
    const sig: Signature = signingKey.sign(hashTx, "base64");

    this.signature = sig.toDER("hex");
  }

  public isValid(): boolean {
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction!");
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");

    return publicKey.verify(this.calculateHash(), this.signature);
  }
}
