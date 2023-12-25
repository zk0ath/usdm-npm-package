var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { State, state, UInt64, SmartContract, AccountUpdate, method, PublicKey, Permissions, Signature, UInt32 } from 'o1js';
export class TokenContract extends SmartContract {
    constructor() {
        super(...arguments);
        this.totalAmountInCirculation = State();
        this.mintNonce = State();
        this.owner = State();
    }
    init() {
        super.init();
        const permissionToEdit = Permissions.proof();
        this.account.permissions.set({
            ...Permissions.default(),
            editState: permissionToEdit,
            setTokenSymbol: permissionToEdit,
            send: permissionToEdit,
            receive: permissionToEdit,
        });
        this.account.tokenSymbol.set("USDM3");
        this.totalAmountInCirculation.set(UInt64.zero);
        this.mintNonce.set(UInt32.zero);
        this.owner.set(this.address);
    }
    onlyOwner() {
        this.address.assertEquals(this.owner.get());
    }
    mint(receiverAddress, amount, adminSignature) {
        this.onlyOwner();
        this.totalAmountInCirculation.assertEquals(this.totalAmountInCirculation.get());
        let totalAmountInCirculation = this.totalAmountInCirculation.get();
        this.mintNonce.assertEquals(this.mintNonce.get());
        let nonce = this.mintNonce.get();
        adminSignature
            .verify(this.address, amount.toFields().concat(...receiverAddress.toFields()))
            .assertTrue("Admin signature is invalid");
        this.token.mint({
            address: receiverAddress,
            amount,
        });
        let newTotalAmountInCirculation = totalAmountInCirculation.add(amount);
        this.mintNonce.set(nonce.add(1));
        this.totalAmountInCirculation.set(newTotalAmountInCirculation);
    }
    burn(senderAddress, amount, adminSignature) {
        this.onlyOwner();
        this.totalAmountInCirculation.assertEquals(this.totalAmountInCirculation.get());
        let totalAmountInCirculation = this.totalAmountInCirculation.get();
        adminSignature
            .verify(this.address, amount.toFields().concat(...senderAddress.toFields()))
            .assertTrue("Admin signature is invalid");
        this.token.burn({
            address: senderAddress,
            amount,
        });
        let newTotalAmountInCirculation = totalAmountInCirculation.sub(amount);
        this.totalAmountInCirculation.set(newTotalAmountInCirculation);
    }
    transfer(senderAddress, receiverAddress, amount) {
        this.onlyOwner();
        const senderBalance = this.getBalance(senderAddress);
        senderBalance.assertGreaterThanOrEqual(amount, "Sender does not have enough balance");
        this.token.send({
            from: senderAddress,
            to: receiverAddress,
            amount,
        });
    }
    getBalance(address) {
        let accountUpdate = AccountUpdate.create(address, this.token.id);
        let balance = accountUpdate.account.balance.get();
        return balance;
    }
}
__decorate([
    state(UInt64),
    __metadata("design:type", Object)
], TokenContract.prototype, "totalAmountInCirculation", void 0);
__decorate([
    state(UInt32),
    __metadata("design:type", Object)
], TokenContract.prototype, "mintNonce", void 0);
__decorate([
    state(PublicKey),
    __metadata("design:type", Object)
], TokenContract.prototype, "owner", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey, UInt64, Signature]),
    __metadata("design:returntype", void 0)
], TokenContract.prototype, "mint", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey, UInt64, Signature]),
    __metadata("design:returntype", void 0)
], TokenContract.prototype, "burn", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey,
        PublicKey,
        UInt64]),
    __metadata("design:returntype", void 0)
], TokenContract.prototype, "transfer", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey]),
    __metadata("design:returntype", UInt64)
], TokenContract.prototype, "getBalance", null);
//# sourceMappingURL=TokenContract.js.map