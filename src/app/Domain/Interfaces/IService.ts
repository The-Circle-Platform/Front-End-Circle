import { Observable } from "rxjs"
import {userDTO} from "../Models/User";

export interface IService<T>{
    Get(id: number): Observable<userDTO>
    GetAll():Observable<userDTO[]>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Create(entity: T): Observable<userDTO>

    Update(entity: T): Observable<userDTO>
}