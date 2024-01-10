import {OemModel} from "../MasterData/Oem.model";
import {HarnessMakerModel} from "../MasterData/HarnessMaker.model";
import {ComponentModel} from "../MasterData/Component.model";
import {BomModel} from "./Bom.model";
import {BomCModel} from "./BomC.model";
import {BomCDModel} from "./BomCD.model";
import {BomPModel} from "./BomP.model";
import {CableModel} from "../MasterData/Cable.model";

export class ProjectModel{

    oemId:string;
    oemname:string;
    cableId:string;
    categoryId:string;
    harnessMakerId:string;
    cables:CableModel[] | any;
    components:ComponentModel[];
    projectNumber: number;
    partNumber: any;
    customerPN: any;
    countSides: number = 0;
    left: ComponentModel[];
    right: ComponentModel[];
    BOM: BomModel[] = [];
    BOMC: BomCModel[] = [];
    

    BOMCD: BomCDModel[] = [];
    BOMP: BomPModel[] = [];
    cablename: string;

    PDMLINK: ComponentModel[];
    componentId:string;

    cd_picture: any;
    cd_lengths: any;
    cd_bom: any;
    cd_notes: any;

    pinning: any;

    pd_picture: any;
    pd_bom: any;
    pd_notes: any;
    pd_lengths: any;

    packaging: any;


    CableTypeData :any[]= [];
}
