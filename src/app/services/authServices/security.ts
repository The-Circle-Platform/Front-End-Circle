import { Injectable } from '@angular/core';
import * as crypto from 'jsencrypt';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

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

    encryptWithServerPublicKey(plaintext: string): string {
        this.serverCrypto.setPublicKey(environment.SERVER_PUBLIC_KEY);
        const enc = this.serverCrypto.encrypt(plaintext);
        return enc.toString();
    }

    sign(plaintext: string): string | false {
        this.userCrypto.setPublicKey(
            'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMJefUpb8rGnf7WiUtC4funvWKjgLQIoXrUbJItDb2Q5Dq4NAaYMtih/2iq4eABCn9keb+NWe2F2ZcbyI7iLwj+UiLVpCffgj3CfoeYExE1RqLn1S5CXI9kMJNaTsQXPSA/BnjppX+5Z0zAI+TZef44B6NwRIsE/dYb0dtMejT+VAgMBAAECgYAJ+JLw15qxpmgUx0j8UBqioZaowydL7wo8vDG5uzHhsFOidiRZgllt5nEos+HkEYblunv+65bUvyAlfpJ6iyDhzxgs9fSapdkhiz057BVkmwOqzIDDefHjpqh00k+sEZWeZKq0flXG12yF8LI4c1qXnjTnTUCVzIJXhe4kPqufGQJBAMkIY+8QG4EO4RsvOkdS4Bmz+GSZr7n9FLKsWEQU958v99aGC4T8OLaMFpztRrDwj7tZcvEWl7qVHbI5aTrjnbcCQQD3g6oZdQSLEvU4F4NIiUijTMtMgImzKujbhLdchETqrG0G4UUzGl5Itp/NMhLjscsykgl5mlI/4N2We2Hoi80TAkAEP5olDjkWlCLruSbJJRY5VNVWAu10x8VtNTk0TyEgixn4vaJ2sAHe0b0UmesZiCvxcKV+NNUGC2qyPoZbyT2nAkEA4VhTPngmWcQ51Aa8NQcgReS91vnT5HZ1qJ5tHmMiJ5IydSgVi5A/NO5oETa8secGPBVvYPIaXiQJOl885a6aVwJBALIPMLuUps82cKIanFRh0OC8vIZwtFgv8PUpCAYDG1LKo6RDaSoRL7qtighAagxp+pYcU0rQAyuwHf9mHGiyESM='
        );
        this.userCrypto.setKey(
            'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMJefUpb8rGnf7WiUtC4funvWKjgLQIoXrUbJItDb2Q5Dq4NAaYMtih/2iq4eABCn9keb+NWe2F2ZcbyI7iLwj+UiLVpCffgj3CfoeYExE1RqLn1S5CXI9kMJNaTsQXPSA/BnjppX+5Z0zAI+TZef44B6NwRIsE/dYb0dtMejT+VAgMBAAECgYAJ+JLw15qxpmgUx0j8UBqioZaowydL7wo8vDG5uzHhsFOidiRZgllt5nEos+HkEYblunv+65bUvyAlfpJ6iyDhzxgs9fSapdkhiz057BVkmwOqzIDDefHjpqh00k+sEZWeZKq0flXG12yF8LI4c1qXnjTnTUCVzIJXhe4kPqufGQJBAMkIY+8QG4EO4RsvOkdS4Bmz+GSZr7n9FLKsWEQU958v99aGC4T8OLaMFpztRrDwj7tZcvEWl7qVHbI5aTrjnbcCQQD3g6oZdQSLEvU4F4NIiUijTMtMgImzKujbhLdchETqrG0G4UUzGl5Itp/NMhLjscsykgl5mlI/4N2We2Hoi80TAkAEP5olDjkWlCLruSbJJRY5VNVWAu10x8VtNTk0TyEgixn4vaJ2sAHe0b0UmesZiCvxcKV+NNUGC2qyPoZbyT2nAkEA4VhTPngmWcQ51Aa8NQcgReS91vnT5HZ1qJ5tHmMiJ5IydSgVi5A/NO5oETa8secGPBVvYPIaXiQJOl885a6aVwJBALIPMLuUps82cKIanFRh0OC8vIZwtFgv8PUpCAYDG1LKo6RDaSoRL7qtighAagxp+pYcU0rQAyuwHf9mHGiyESM='
        );
        this.userCrypto.setPrivateKey(
            'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMJefUpb8rGnf7WiUtC4funvWKjgLQIoXrUbJItDb2Q5Dq4NAaYMtih/2iq4eABCn9keb+NWe2F2ZcbyI7iLwj+UiLVpCffgj3CfoeYExE1RqLn1S5CXI9kMJNaTsQXPSA/BnjppX+5Z0zAI+TZef44B6NwRIsE/dYb0dtMejT+VAgMBAAECgYAJ+JLw15qxpmgUx0j8UBqioZaowydL7wo8vDG5uzHhsFOidiRZgllt5nEos+HkEYblunv+65bUvyAlfpJ6iyDhzxgs9fSapdkhiz057BVkmwOqzIDDefHjpqh00k+sEZWeZKq0flXG12yF8LI4c1qXnjTnTUCVzIJXhe4kPqufGQJBAMkIY+8QG4EO4RsvOkdS4Bmz+GSZr7n9FLKsWEQU958v99aGC4T8OLaMFpztRrDwj7tZcvEWl7qVHbI5aTrjnbcCQQD3g6oZdQSLEvU4F4NIiUijTMtMgImzKujbhLdchETqrG0G4UUzGl5Itp/NMhLjscsykgl5mlI/4N2We2Hoi80TAkAEP5olDjkWlCLruSbJJRY5VNVWAu10x8VtNTk0TyEgixn4vaJ2sAHe0b0UmesZiCvxcKV+NNUGC2qyPoZbyT2nAkEA4VhTPngmWcQ51Aa8NQcgReS91vnT5HZ1qJ5tHmMiJ5IydSgVi5A/NO5oETa8secGPBVvYPIaXiQJOl885a6aVwJBALIPMLuUps82cKIanFRh0OC8vIZwtFgv8PUpCAYDG1LKo6RDaSoRL7qtighAagxp+pYcU0rQAyuwHf9mHGiyESM='
        );

        const signature = this.userCrypto.sign(
            '{"id":1,"username":"jascha","isonline":false,"followcount":0,"balance":0}',
            // @ts-ignore
            CryptoJS.SHA256,
            'sha256'
        );
        //console.log(signature)
        return signature;
    }

    verify(message: any, signature: string): boolean {
        const messageJson = JSON.stringify(message, null, 0).toLowerCase();

        this.serverCrypto.setPublicKey(environment.SERVER_PUBLIC_KEY);
        //console.log(message);
        console.log(signature);

        const verified = this.serverCrypto.verify(
            messageJson,
            signature,
            // @ts-ignore
            CryptoJS.SHA256
        );
        //console.log(verified)
        return verified;
    }
}
