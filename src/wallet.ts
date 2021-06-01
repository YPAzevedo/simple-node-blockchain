import * as crypto from "crypto";
import { Chain } from "./chain";
import { transaction } from "./transaction";

export function wallet() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  function sendMoney({
    amount,
    payeePublicKey,
  }: {
    amount: number;
    payeePublicKey: string;
  }) {
    const $transaction = transaction({
      amount,
      payee: payeePublicKey,
      payer: publicKey,
    });

    const sign = crypto.createSign("SHA256");
    sign.update($transaction.toString()).end();

    const signature = sign.sign(privateKey);

    Chain.addBlock({
      transaction: $transaction,
      senderPublicKey: publicKey,
      signature,
    });
  }

  return {
    privateKey,
    publicKey,
    sendMoney,
  };
}
