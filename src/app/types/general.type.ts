import * as EC from "elliptic";

export interface KeyPair extends EC.ec.KeyPair {};
export interface Signature extends EC.ec.Signature {};

export interface WalletKey {
  key: KeyPair;
  publicKey: string;
  privateKey: string;
}
