import { Component, OnInit } from '@angular/core';

import { BlockChainService } from './services/blockchain.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public blockchain;
  public showInfoMessage = true;

  constructor(private blockChainService: BlockChainService) {
    this.blockchain = blockChainService.blockChainInstance;
  }

  ngOnInit() {}

  thereArePendingTransactions() {
    return this.blockchain.pendingTransactions.length > 0;
  }

  dismissInfoMessage() {
    this.showInfoMessage = false;
  }
}
