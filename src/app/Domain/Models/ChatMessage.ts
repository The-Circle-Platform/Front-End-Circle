import { IContent, IOutResponsePayload } from "../Interfaces/IContent";
import { IDomain } from "../Interfaces/IDomain";
import { User } from "./User";

export interface ChatMessage extends IDomain {
    message: string
    writer: User
    receiverUser: User
    date: Date
}

export interface ChatMessageDTO extends IDomain{
    Message: string
    WebUserId: number
    ReceiverId: number
    Date: Date
}

// Used with payload.
export interface ChatRequestDTO extends IContent{
    OriginalData: ChatMessageDTO
}

export interface ChatResponseDTO extends IOutResponsePayload{
    OriginalList: ChatMessage[]
}

export interface ChatResponseOneDTO extends IOutResponsePayload{
    OriginalData: ChatMessage
}