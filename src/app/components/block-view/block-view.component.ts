import { Component, OnInit, Input } from '@angular/core';
import { Block } from '../../classes/block';

import { BlockChainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-block-view',
  templateUrl: './block-view.component.html',
  styleUrls: ['./block-view.component.scss']
})
export class BlockViewComponent implements OnInit {
  @Input()
  public block: Block;

  @Input()
  public selectedBlock: Block;

  private blocksInChain: Block[];

  constructor(blockChainService: BlockChainService) {
    this.blocksInChain = blockChainService.blockChainInstance.chain;
  }

  ngOnInit() {}

  public blockHasTransaction(): boolean {
    return this.block.transactions.length > 0;
  }

  public isSelectedBlock(): boolean {
    return this.block === this.selectedBlock;
  }

  public getBlockNumber(): number {
    return this.blocksInChain.indexOf(this.block) + 1;
  }
}
