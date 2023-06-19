import { IDomain } from "../Interfaces/IDomain";
import { User } from "./User";

export interface VideoStream extends IDomain{
    title: string
    startStream: Date
    endStream : Date
    streamUserId: number
    User: User | undefined
}