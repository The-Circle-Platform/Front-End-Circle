import { Observable } from "rxjs"

export interface IService<T>{
    Get(id: number): Observable<T>
    GetAll():Observable<T[]>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Create(entity: T): Observable<any>

    Update(entity: T): Observable<T>
}