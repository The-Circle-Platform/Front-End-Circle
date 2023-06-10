import { IDomain } from "../Interfaces/IDomain";
import { User } from "./User";

export interface ChatMessage extends IDomain {
    Message: string
    Writer: number | User
    Receiver: number | User
    DateOfWriting: Date
}