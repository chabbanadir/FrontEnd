export abstract class AuditableEntity {

    public id: string;
    public created: Date;
    public createdBy: string;
    public lastModified: Date;
    public lastModifiedBy: string;
    public isDeleted: boolean;
}