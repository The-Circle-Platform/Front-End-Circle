import { IDomain } from "../Interfaces/IDomain";
import { User } from "./User";

export interface ChatMessage extends IDomain {
    Message: string
    Writer: User
    Receiver: User
    DateOfWriting: Date
}

export interface ChatMessageDTO extends IDomain{
    Message: string
    WriterId: number
    ReceiverId: number
    DateOfWriting: Date
}