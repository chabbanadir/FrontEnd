import {AuditableEntity} from "../../Common/AuditableEntity";
import {Status} from "../../Enums/Status";

export class PackageModel extends AuditableEntity{

    public  layer: string;
    public  pn: string;
    public  qte: string;
    public  order: number = 0;
    public  status: Status = Status.Active;

}