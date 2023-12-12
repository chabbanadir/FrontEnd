import {AuditableEntity} from "../../Common/AuditableEntity";
import {Status} from "../../Enums/Status";
import {ComponentModel} from "./Component.model";
import {CableModel} from "./Cable.model";

export class OemModel extends AuditableEntity{
    public  name: string;
    public  status: Status = Status.Inactive;
    public  components: ComponentModel[];
    public  cables: CableModel[];
}