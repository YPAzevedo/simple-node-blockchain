import * as crypto from "crypto";
import { block, Block } from "./block";
import { transaction, Transaction } from "./transaction";

function chain() {
  const TARGET_VALUE = 1.2e35;

  let $chain: Block[] = [
    block({
      prevHash: "NULL",
      transaction: transaction({
        amount: 100,
        payer: "GENESIS",
        payee: "THExONE",
      }),
    }),
  ];

  function mine(nonce: number) {
    let solution = 1;
    let foundSolution = false;
    console.log("⛏ - Mining...");

    while (!foundSolution) {
      const hash = crypto.createHash("MD5");
      hash.update((nonce + solution).toString()).end();

      const hex = hash.digest("hex");

      const hexValue = parseInt(`0x${hex}`, 16);

      if (hexValue < TARGET_VALUE) {
        console.log(`🆗 - Solved in ${solution} attempts.`);
        foundSolution = true;
      }

      solution++;
    }
  }

  function getLastBlock() {
    return $chain[$chain.length - 1];
  }

  function addBlock({
    transaction,
    senderPublicKey,
    signature,
  }: {
    transaction: Transaction;
    senderPublicKey: string;
    signature: Buffer;
  }) {
    const verifier = crypto.createVerify("SHA256");
    verifier.update(transaction.toString());

    const isValid = verifier.verify(senderPublicKey, signature);

    if (!isValid) return;
    const newBlock = block({ transaction, prevHash: getLastBlock().getHash() });
    mine(newBlock.nonce);
    $chain.push(newBlock);
    console.log(
      `🤝 - Transaction complete from ${transaction.payer} to ${transaction.payee}`
    );
  }

  return {
    chain: $chain,
    getLastBlock,
    addBlock,
  };
}

export const Chain = chain();
