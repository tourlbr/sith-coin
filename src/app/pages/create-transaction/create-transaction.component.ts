import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Transaction } from "../../classes/transaction";
import { BlockChainService } from "../../services/blockchain.service";
import { WalletKey } from "../../types/general.type";

@Component({
  selector: "app-create-transaction",
  templateUrl: "./create-transaction.component.html",
  styleUrls: ["./create-transaction.component.scss"]
})
export class CreateTransactionComponent implements OnInit {
  public newTransaction: Transaction;
  public ownWalletKey: WalletKey;

  constructor(private blockChainService: BlockChainService, private router: Router) {
    this.newTransaction =  new Transaction(null, "Ajunta Pall", 0);
    this.ownWalletKey = blockChainService.walletKeys[0];
  }

  ngOnInit() {
  }

  createTransaction() {
    const newTransaction = this.newTransaction;

    // Set the FROM address and sign the transaction
    newTransaction.fromAddress = this.ownWalletKey.publicKey;
    newTransaction.signTransaction(this.ownWalletKey.key);

    try {
      this.blockChainService.addTransaction(this.newTransaction);
    } catch (error) {
      alert(error);
      return;
    }

    this.router.navigate(["/new/transaction/pending", { addedTransaction: true }]);
    this.newTransaction = new Transaction(null, "Ajunta Pall", 0);
  }
}
