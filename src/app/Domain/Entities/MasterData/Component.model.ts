import {AuditableEntity} from "../../Common/AuditableEntity";
import {OemModel} from "./Oem.model";
import {CategoryModel} from "./Category.model";

import {ConfigurationModel} from "./Configuration.model";
import {Status} from "../../Enums/Status";
import {PictureModel} from "./Picture.model";
import {ShowIn} from "../../Enums/ShowIn";
import {CableModel} from "./Cable.model";
import {Orientation} from "../../Enums/Orientation";

export class ComponentModel extends AuditableEntity {
    name: string;
    tE_PN: string;
    customer_PN: string;
    pdM_LINK_PN: string;
    rev: string;
    description: string;
    length: number = 0;
    position: number = 0;
    showIn: ShowIn = ShowIn.CD_And_PD;

    oem: OemModel;
    category: CategoryModel;
    cable: CableModel;
    config: ConfigurationModel;
    picture: PictureModel;
  //  cable: CableModel;

    cables: any = [];
    parts: any = [];
    //partsv: ComponentModel[] = [];

    status: Status = Status.Inactive;
    orientation: Orientation = Orientation.Left;


    // FKs
    fK_OemId: string;
    fK_CategoryId: string;
    fK_ConfigId: string;
    fK_PictureId: string;
    fK_CableId: string;
}