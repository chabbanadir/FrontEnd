import {AuditableEntity} from "../../Common/AuditableEntity";

export class PictureModel extends AuditableEntity{
    public  name: string;
    public picPath: string;
}