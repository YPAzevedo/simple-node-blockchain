import { wallet } from "./wallet";

const anna = wallet();
const john = wallet();

john.sendMoney({ amount: 100, payeePublicKey: anna.publicKey });
