import {AuditableEntity} from "../../../Domain/Common/AuditableEntity";

export interface IAsyncRepository {


    GetAllAsync(): Promise<any[]>;

    GetByIdAsync(id: any): Promise<any>;

    CreateAsync(entity: any): Promise<void>;

    UpdateAsync(entity: any, Id:any): Promise<void>;
    PatchAsync(entity: any, Id:any): Promise<void>;

    DeleteAsync(id: any): Promise<void>;

    ShowMessage(message: any, isSuccess: any);
}