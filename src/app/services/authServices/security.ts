import { Injectable } from "@angular/core"
import {config} from "rxjs";
import {Buffer} from 'buffer/';
// import * as crypto from "crypto-browserify";
import * as crypto from "jsencrypt";
import * as CryptoJS from 'crypto-js';
import {environment} from "../../../environments/environment";
import {JSEncrypt} from "jsencrypt";

@Injectable({providedIn: 'root'})
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
        this.userPrivateKey = localStorage.getItem("privateKey")!;
        this.userPublicKey = localStorage.getItem("publicKey")!;
        this.userCrypto.setPrivateKey(this.userPublicKey); // You can only Encrypt with the public key with this library
        this.userCrypto.setPublicKey(this.userPrivateKey); // You can only Decrypt with the private key with this library

        this.serverPublicKey = localStorage.getItem("publicKey")!;
        this.serverCrypto.setPrivateKey(this.serverPublicKey); // You can only Decrypt with the private key with this library
    }

    encryptWithServerPublicKey(plaintext: string): string {
        let enc = this.serverCrypto.encrypt(plaintext);
        return enc.toString();
    }


    sign(plaintext: string): string | false {
        // @ts-ignore
        var signature = this.userCrypto.sign(string, CryptoJS.SHA256, "sha256");
        console.log(signature)
        return signature;
    }

    verify(message: string, signature: string): boolean {
        // @ts-ignore
        var verified = this.serverCrypto.verify(hash, signature, CryptoJS.SHA256);
        console.log(verified)
        return verified;
    }


}
