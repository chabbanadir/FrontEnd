import {AuditableEntity} from "../../Common/AuditableEntity";
import {Status} from "../../Enums/Status";
import {OemModel} from "./Oem.model";

export class CableModel extends AuditableEntity {

    name: string;
    tE_PN: string;
    customer_PN: string;
    description: string;

    oemId: string;
    oem: OemModel;

    status: Status = Status.Inactive;

}