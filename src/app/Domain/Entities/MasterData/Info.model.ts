import {AuditableEntity} from "../../Common/AuditableEntity";
import {Status} from "../../Enums/Status";
import {OemModel} from "./Oem.model";
import {CableModel} from "./Cable.model";
import {ComponentModel} from "./Component.model";
import {HarnessMakerModel} from "./HarnessMaker.model";

export class InfoModel extends AuditableEntity{
 
    public  BaseNumber: string;
    public  name: string;
    public  CustomerPn: string;
    public  ProjectNumber: string;
    public  ComponentsCount: string;
    
    
    

    oem: OemModel;
    component: ComponentModel;
    cable: CableModel;
    harnessMaker: HarnessMakerModel;
    //picture: PictureModel;
  //  cable: CableModel;

    cables: any = [];
    //parts: any = [];
    //partsv: ComponentModel[] = [];

    //status: Status = Status.Inactive;
    //orientation: Orientation = Orientation.Left;


    // FKs
    fK_OemId: string;
    fK_CategoryId: string;
    fK_ConfigId: string;
    //fK_PictureId: string;
    fK_CableId: string;


    fK_HarnessmakerId: string;

    
    // fK_OemId: string;
    // fK_ComponentId: string;
    // fK_CableId: string;

    // oemId: string;
    // oem: OemModel;

    // cableId: string;
    // cable: CableModel;

    // componentId: string;
    // component: ComponentModel;

    // harnessmakerId: string;
    // harnessmaker: HarnessMakerModel;

    
    // public  status: Status = Status.Inactive;
}