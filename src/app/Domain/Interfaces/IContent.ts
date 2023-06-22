export interface IContent {
    Signature: any;
    SenderUserId: number;
}

export interface IOutResponsePayload extends IContent {
    PublicKey: string;
}
