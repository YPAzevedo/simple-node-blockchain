import * as crypto from "crypto";

export interface Transaction {
  amount: number;
  payer: string;
  payee: string;
  toString(): string;
}

export function transaction({ amount, payer, payee }: Transaction) {
  const $transaction = {
    amount,
    payer,
    payee,
  };

  return {
    ...$transaction,
    toString() {
      return JSON.stringify($transaction);
    },
  };
}
