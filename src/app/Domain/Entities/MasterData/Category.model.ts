import {AuditableEntity} from "../../Common/AuditableEntity";
import {Status} from "../../Enums/Status";
import {PictureModel} from "./Picture.model";

export class CategoryModel extends AuditableEntity{
    public  name: string;
    public  status: Status = Status.Active;
    public  hasNote: boolean = false;
    public  hasCable: boolean = false;
    public  hasConfig:boolean = false;
    public  picture: PictureModel;
}
