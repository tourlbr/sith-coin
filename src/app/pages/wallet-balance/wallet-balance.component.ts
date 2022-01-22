import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Transaction } from '../../classes/transaction';
import { BlockChainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-wallet-balance',
  templateUrl: './wallet-balance.component.html',
  styleUrls: ['./wallet-balance.component.scss']
})
export class WalletBalanceComponent implements OnInit {
  public walletAddress: string = 'Ajunta Pall';
  public balance = 0;
  public transactions: Transaction[] = [];

  constructor(private route: ActivatedRoute, private blockChainService: BlockChainService) {}

  ngOnInit() {
    this.route.params.subscribe( (params) => {
        this.walletAddress = params['address'];

        const blockchain = this.blockChainService.blockChainInstance;
        this.balance = blockchain.getBalanceOfAddress(this.walletAddress);
        this.transactions = blockchain.getAllTransactionsForWallet(this.walletAddress);
    });
  }

}
