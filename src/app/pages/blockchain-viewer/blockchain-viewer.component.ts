import { Component, OnInit } from '@angular/core';

import { Block } from '../../classes/block';
import { BlockChainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-blockchain-viewer',
  templateUrl: './blockchain-viewer.component.html',
  styleUrls: ['./blockchain-viewer.component.scss']
})
export class BlockchainViewerComponent implements OnInit {

  public blocks: Block[] = [];
  public selectedBlock: Block;

  constructor(blockChainService: BlockChainService) {
    this.blocks = blockChainService.blockChainInstance.chain;
    this.selectedBlock = this.blocks[0];
  }

  ngOnInit() {}

  public showTransactions(block: Block): boolean {
    this.selectedBlock = block;
    return false;
  }

  public blockHasTransaction(block: Block): boolean {
    return block.transactions.length > 0;
  }

  public selectedBlockHasTransaction(): boolean {
    return this.blockHasTransaction(this.selectedBlock);
  }

  public isSelectedBlock(block: Block): boolean {
    return this.selectedBlock === block;
  }

  public getBlockNumber(block: Block): number {
    return this.blocks.indexOf(block) + 1;
  }
}
