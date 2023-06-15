import { Injectable } from "@angular/core"
import {config} from "rxjs";
import {Buffer} from 'buffer/';
// import * as crypto from "crypto-browserify";
import * as crypto from "jsencrypt";
import {environment} from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class securityService{

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
    private serverPrivateKey: string;
    private serverPublicKey: string;

    private userCrypto = new crypto.JSEncrypt();
    private serverCrypto = new crypto.JSEncrypt();

    constructor() {
        this.userPrivateKey = environment.USER_PRIVATE_KEY;
        this.userPublicKey = environment.SERVER_PUBLIC_KEY;
        this.userCrypto.setPrivateKey(this.userPublicKey); // You can only Encrypt with the public key with this library
        this.userCrypto.setPublicKey(this.userPrivateKey); // You can only Decrypt with the private key with this library

        this.serverPrivateKey = environment.USER_PRIVATE_KEY;
        this.serverPublicKey = environment.SERVER_PUBLIC_KEY;
        this.serverCrypto.setPrivateKey(this.serverPublicKey); // You can only Decrypt with the private key with this library
        this.serverCrypto.setPublicKey(this.serverPrivateKey); // You can only Encrypt with the public key with this library
    }

    encryptWithUserPrivateKey(plaintext: string): string {
        let enc = this.userCrypto.encrypt(plaintext);
        return enc.toString();
    }

    encryptWithServerPublicKey(plaintext: string): string {
        let enc = this.serverCrypto.encrypt(plaintext);
        return enc.toString();
    }

    decryptWithUserPrivateKey(cypher: string): string {
        let enc = this.userCrypto.decrypt(cypher);
        return enc.toString();
    }

    decryptWithServerPublicKey(cypher: string): string {
        let enc = this.serverCrypto.decrypt(cypher);
        return enc.toString();
    }

    
}
