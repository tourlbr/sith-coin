import { Component, OnInit, Input } from '@angular/core';

import { Transaction } from '../../classes/transaction';
import { BlockChainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit {
  @Input()
  public transactions: Transaction[] = [];

  constructor(public blockChainService: BlockChainService) { }

  ngOnInit() {}
}
