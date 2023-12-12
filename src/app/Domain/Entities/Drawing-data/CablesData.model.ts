import {AuditableEntity} from "../../Common/AuditableEntity";
import {Status} from "../../Enums/Status";
import { OemModel } from "../MasterData/Oem.model";

export class CablesData extends AuditableEntity  {

    length : number;
    cableType : string;
    lead : string;
    fromLocation : string;
    toLocation : string;
    fromPort : string;
    toPort : string;
    id : string;


}