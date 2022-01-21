export class Transaction {
  constructor(
    public fromAddress: any,
    public toAddress: any,
    public amount: number
  ) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = this.amount;
  }
}
