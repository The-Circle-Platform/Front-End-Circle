import { Observable } from 'rxjs';

export interface IService<T> {
    Get(id: number): Observable<T>;
    GetAll(): Observable<T[]>;

    Create(entity: T): Observable<any>;
    Update(entity: T): Observable<T>;
}
