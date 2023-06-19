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
        this.userCrypto.setPublicKey("MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMJefUpb8rGnf7WiUtC4funvWKjgLQIoXrUbJItDb2Q5Dq4NAaYMtih/2iq4eABCn9keb+NWe2F2ZcbyI7iLwj+UiLVpCffgj3CfoeYExE1RqLn1S5CXI9kMJNaTsQXPSA/BnjppX+5Z0zAI+TZef44B6NwRIsE/dYb0dtMejT+VAgMBAAECgYAJ+JLw15qxpmgUx0j8UBqioZaowydL7wo8vDG5uzHhsFOidiRZgllt5nEos+HkEYblunv+65bUvyAlfpJ6iyDhzxgs9fSapdkhiz057BVkmwOqzIDDefHjpqh00k+sEZWeZKq0flXG12yF8LI4c1qXnjTnTUCVzIJXhe4kPqufGQJBAMkIY+8QG4EO4RsvOkdS4Bmz+GSZr7n9FLKsWEQU958v99aGC4T8OLaMFpztRrDwj7tZcvEWl7qVHbI5aTrjnbcCQQD3g6oZdQSLEvU4F4NIiUijTMtMgImzKujbhLdchETqrG0G4UUzGl5Itp/NMhLjscsykgl5mlI/4N2We2Hoi80TAkAEP5olDjkWlCLruSbJJRY5VNVWAu10x8VtNTk0TyEgixn4vaJ2sAHe0b0UmesZiCvxcKV+NNUGC2qyPoZbyT2nAkEA4VhTPngmWcQ51Aa8NQcgReS91vnT5HZ1qJ5tHmMiJ5IydSgVi5A/NO5oETa8secGPBVvYPIaXiQJOl885a6aVwJBALIPMLuUps82cKIanFRh0OC8vIZwtFgv8PUpCAYDG1LKo6RDaSoRL7qtighAagxp+pYcU0rQAyuwHf9mHGiyESM=");
        this.userCrypto.setKey("MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMJefUpb8rGnf7WiUtC4funvWKjgLQIoXrUbJItDb2Q5Dq4NAaYMtih/2iq4eABCn9keb+NWe2F2ZcbyI7iLwj+UiLVpCffgj3CfoeYExE1RqLn1S5CXI9kMJNaTsQXPSA/BnjppX+5Z0zAI+TZef44B6NwRIsE/dYb0dtMejT+VAgMBAAECgYAJ+JLw15qxpmgUx0j8UBqioZaowydL7wo8vDG5uzHhsFOidiRZgllt5nEos+HkEYblunv+65bUvyAlfpJ6iyDhzxgs9fSapdkhiz057BVkmwOqzIDDefHjpqh00k+sEZWeZKq0flXG12yF8LI4c1qXnjTnTUCVzIJXhe4kPqufGQJBAMkIY+8QG4EO4RsvOkdS4Bmz+GSZr7n9FLKsWEQU958v99aGC4T8OLaMFpztRrDwj7tZcvEWl7qVHbI5aTrjnbcCQQD3g6oZdQSLEvU4F4NIiUijTMtMgImzKujbhLdchETqrG0G4UUzGl5Itp/NMhLjscsykgl5mlI/4N2We2Hoi80TAkAEP5olDjkWlCLruSbJJRY5VNVWAu10x8VtNTk0TyEgixn4vaJ2sAHe0b0UmesZiCvxcKV+NNUGC2qyPoZbyT2nAkEA4VhTPngmWcQ51Aa8NQcgReS91vnT5HZ1qJ5tHmMiJ5IydSgVi5A/NO5oETa8secGPBVvYPIaXiQJOl885a6aVwJBALIPMLuUps82cKIanFRh0OC8vIZwtFgv8PUpCAYDG1LKo6RDaSoRL7qtighAagxp+pYcU0rQAyuwHf9mHGiyESM=");
        this.userCrypto.setPrivateKey("MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMJefUpb8rGnf7WiUtC4funvWKjgLQIoXrUbJItDb2Q5Dq4NAaYMtih/2iq4eABCn9keb+NWe2F2ZcbyI7iLwj+UiLVpCffgj3CfoeYExE1RqLn1S5CXI9kMJNaTsQXPSA/BnjppX+5Z0zAI+TZef44B6NwRIsE/dYb0dtMejT+VAgMBAAECgYAJ+JLw15qxpmgUx0j8UBqioZaowydL7wo8vDG5uzHhsFOidiRZgllt5nEos+HkEYblunv+65bUvyAlfpJ6iyDhzxgs9fSapdkhiz057BVkmwOqzIDDefHjpqh00k+sEZWeZKq0flXG12yF8LI4c1qXnjTnTUCVzIJXhe4kPqufGQJBAMkIY+8QG4EO4RsvOkdS4Bmz+GSZr7n9FLKsWEQU958v99aGC4T8OLaMFpztRrDwj7tZcvEWl7qVHbI5aTrjnbcCQQD3g6oZdQSLEvU4F4NIiUijTMtMgImzKujbhLdchETqrG0G4UUzGl5Itp/NMhLjscsykgl5mlI/4N2We2Hoi80TAkAEP5olDjkWlCLruSbJJRY5VNVWAu10x8VtNTk0TyEgixn4vaJ2sAHe0b0UmesZiCvxcKV+NNUGC2qyPoZbyT2nAkEA4VhTPngmWcQ51Aa8NQcgReS91vnT5HZ1qJ5tHmMiJ5IydSgVi5A/NO5oETa8secGPBVvYPIaXiQJOl885a6aVwJBALIPMLuUps82cKIanFRh0OC8vIZwtFgv8PUpCAYDG1LKo6RDaSoRL7qtighAagxp+pYcU0rQAyuwHf9mHGiyESM=");
   
        const signature = this.userCrypto.sign('[{"Id":1,"UserName":"Jascha","IsOnline":false,"UserChatMessages":null,"StreamChatMessages":null,"CurrentWatchList":null}]', CryptoJS.SHA256, "sha256");
        //console.log(signature)
        return signature;
    }

    verify(message: any | any[], signature: string): boolean {
        this.serverCrypto.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCXn1KW/Kxp3+1olLQuH7p71io4C0CKF61GySLQ29kOQ6uDQGmDLYof9oquHgAQp/ZHm/jVnthdmXG8iO4i8I/lIi1aQn34I9wn6HmBMRNUai59UuQlyPZDCTWk7EFz0gPwZ46aV/uWdMwCPk2Xn+OAejcESLBP3WG9HbTHo0/lQIDAQAB");
        //console.log(message);
        console.log(signature);
        console.log(message);
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const verified = this.serverCrypto.verify(message, signature , CryptoJS.SHA256);
        console.log(verified)
        return verified;
    }


}
