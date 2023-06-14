import { Injectable } from "@angular/core"
import {config} from "rxjs";
import {Buffer} from 'buffer/';
// import * as crypto from "crypto-browserify";
import * as crypto from "crypto-browserify";

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
    private serverPublicKey: string;

    constructor() {
        // this.userPrivateKey = userPrivateKey;
        // this.serverPublicKey = serverPublicKey;
        this.userPrivateKey = "userPrivateKey";
        this.serverPublicKey = "serverPublicKey";
    }

    encryptPrivate(plaintext: string): string {
        let buffer = new Buffer(plaintext);
        let encrypted = crypto.privateEncrypt(this.userPrivateKey, buffer);

        return encrypted.toString('base64');
    }

    encryptPublic(plaintext: string): string {
        let buffer = new Buffer(plaintext);
        let encrypted = crypto.publicEncrypt(this.serverPublicKey, buffer);

        return encrypted.toString('base64');
    }

    decryptPrivate(cypher: string): string {
        let buffer = Buffer.from(cypher, 'base64');
        let plaintext = crypto.privateDecrypt(this.userPrivateKey, buffer);

        return plaintext.toString('utf8')
    }

    decryptPublic(cypher: string): string {
        let buffer = Buffer.from(cypher, 'base64');
        let plaintext = crypto.publicDecrypt(this.serverPublicKey, buffer);

        return plaintext.toString('utf8')
    }
}
