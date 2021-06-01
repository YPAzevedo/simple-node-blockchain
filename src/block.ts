import * as crypto from "crypto";
import { Transaction } from "./transaction";

export interface BlockContract {
  prevHash: string;
  transaction: Transaction;
}

export interface Block extends BlockContract {
  timestamp: number;
  nonce: number;
  getHash(): string;
}

export function block({ prevHash, transaction }: BlockContract): Block {
  const $block = {
    prevHash,
    transaction,
    timestamp: Date.now(),
    nonce: Math.round(Math.random() * 9999999999),
  };

  return {
    ...$block,
    getHash() {
      const str = JSON.stringify($block);
      const hash = crypto.createHash("SHA256");
      hash.update(str).end();
      return hash.digest("hex");
    },
  };
}
