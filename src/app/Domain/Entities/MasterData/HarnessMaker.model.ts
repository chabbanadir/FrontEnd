import {AuditableEntity} from "../../Common/AuditableEntity";
import {Status} from "../../Enums/Status";

export class HarnessMakerModel extends AuditableEntity{
    public  name: string;
    public  manufacturing_code: string;
    public  bar_code: string;
    public  status: Status = Status.Inactive;
}