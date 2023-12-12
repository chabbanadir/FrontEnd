import {AuditableEntity} from "../../Common/AuditableEntity";
import {OemModel} from "./Oem.model";
import {CategoryModel} from "./Category.model";
import {ConfigurationModel} from "./Configuration.model";
import {Status} from "../../Enums/Status";
import {PictureModel} from "./Picture.model";
import {ShowIn} from "../../Enums/ShowIn";
import {CableModel} from "./Cable.model";
import {Orientation} from "../../Enums/Orientation";
import {ComponentModel} from "./Component.model";

export class CablePartModel extends AuditableEntity {
    fK_ComponentId: string;
    fK_CableId: string;
}