import { User } from "../Models/User"

export interface IContent{
    Signature: ArrayBuffer[]
    SenderUserId: number
}

export interface IOutResponsePayload extends IContent{
    PublicKey: string
}

