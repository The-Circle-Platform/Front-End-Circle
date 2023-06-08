import { Injectable } from "@angular/core"

@Injectable({providedIn: 'root'})
export class securityService{

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    encryptMessage(entity:any){
        // TODO document why this method 'encryptMessage' is empty
        throw new Error("Not yet implemented")
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decryptMessage(entity:any){
      // TODO document why this method 'decryptMessage' is empty
        throw new Error("Not yet implemented")
    }
}