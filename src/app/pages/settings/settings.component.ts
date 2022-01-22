import { Component, OnInit } from '@angular/core';

import { BlockChainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public blockchain;

  constructor(private blockChainService: BlockChainService) {
    this.blockchain = blockChainService.blockChainInstance;
  }

  ngOnInit() {}
}
