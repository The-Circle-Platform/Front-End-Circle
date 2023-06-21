import { Injectable } from '@angular/core';
import * as crypto from 'jsencrypt';
import * as CryptoJS from 'crypto-js';
import {environment} from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class securityService {
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // encryptMessage(entity:any){
    //     // TODO document why this method 'encryptMessage' is empty
    //
    //     throw new Error("Not yet implemented")
    // }
    //
    // encryptPublicKey(entity: any) :string {
    //
    //     const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
    //     return window.btoa(rsa.encrypt(valueToEncrypt.toString()));
    // }
    //
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // decryptMessage(entity:any){
    //   // TODO document why this method 'decryptMessage' is empty
    //     throw new Error("Not yet implemented")
    // }

    private userPrivateKey: string;
    private userPublicKey: string;
    private serverPublicKey: string;

    private userCrypto = new crypto.JSEncrypt();
    private serverCrypto = new crypto.JSEncrypt();

    constructor() {
        this.userPrivateKey = localStorage.getItem('privateKey')!;
        this.userPublicKey = localStorage.getItem('publicKey')!;
        this.userCrypto.setPrivateKey(this.userPublicKey); // You can only Encrypt with the public key with this library
        this.userCrypto.setPublicKey(this.userPrivateKey); // You can only Decrypt with the private key with this library

        this.serverPublicKey = localStorage.getItem('publicKey')!;
        this.serverCrypto.setPrivateKey(this.serverPublicKey); // You can only Decrypt with the private key with this library
    }


    encryptWithServerPublicKey(plaintext: string): string{
        this.serverCrypto.setPublicKey(environment.SERVER_PUBLIC_KEY);
        const encrypted = this.serverCrypto.encrypt(plaintext);
        return encrypted.toString();
    }

    sign(plaintext: string): string | false {
        console.log(plaintext)
        this.userCrypto.setPrivateKey(localStorage.getItem("privKey")!);
        this.userCrypto.setKey(localStorage.getItem("privKey")!);
        this.userCrypto.setPublicKey(localStorage.getItem("privKey")!);
        console.log(localStorage.getItem("privKey"));
        // @ts-ignore
        const signature = this.userCrypto.sign(plaintext, CryptoJS.SHA256, "sha256");
        console.log(signature)
        return signature;
    }

    verify(message: any, signature: string): boolean {
        const messageJson = JSON.stringify(message, null, 0).toLowerCase();

        this.serverCrypto.setPublicKey(environment.SERVER_PUBLIC_KEY);

        console.log(signature);
        console.log(messageJson);

        const verified = this.serverCrypto.verify(
            messageJson,
            signature,
            // @ts-ignore
            CryptoJS.SHA256
        );
        console.log(verified);
        return verified;
    }
}
