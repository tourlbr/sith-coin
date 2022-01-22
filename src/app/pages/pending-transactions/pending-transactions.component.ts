import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Transaction } from '../../classes/transaction';
import { BlockChainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.scss']
})
export class PendingTransactionsComponent implements OnInit {
  public pendingTransactions: Transaction[] = [];
  public miningInProgress: boolean = false;
  public justAddedTransaction: boolean = false;

  constructor(private blockChainService: BlockChainService, private router: Router, private route: ActivatedRoute) {
    this.pendingTransactions = blockChainService.getPendingTransactions();
  }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('addedTransaction')) {
      this.justAddedTransaction = true;

      setTimeout(() => {
        this.justAddedTransaction = false;
      }, 4000);
    }
  }

  minePendingTransactions() {
    this.miningInProgress = true;
    this.blockChainService.minePendingTransactions();
    this.miningInProgress = false;
    this.router.navigate(['/']);
  }
}
