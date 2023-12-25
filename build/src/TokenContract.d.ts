import { State, UInt64, SmartContract, PublicKey, Signature, UInt32 } from 'o1js';
export declare class TokenContract extends SmartContract {
    totalAmountInCirculation: State<UInt64>;
    mintNonce: State<UInt32>;
    owner: State<PublicKey>;
    init(): void;
    onlyOwner(): void;
    mint(receiverAddress: PublicKey, amount: UInt64, adminSignature: Signature): void;
    burn(senderAddress: PublicKey, amount: UInt64, adminSignature: Signature): void;
    transfer(senderAddress: PublicKey, receiverAddress: PublicKey, amount: UInt64): void;
    getBalance(address: PublicKey): UInt64;
}
