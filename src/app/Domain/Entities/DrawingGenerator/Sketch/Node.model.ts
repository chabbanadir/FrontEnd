import {ComponentModel} from "../../MasterData/Component.model";

export class NodeModel{
    public key: any;
    public name:any;
    public size: any;
    public text: any;
    public img: any;
    public img1: any;
    public color: any;
    public rightArray: any;
    public leftArray: any;
    public topArray: any;
    public bottomArray: any;
    public alphabet: string;
    public loc: any;
    public group: any;
    public isGroup: any;
    public component_orientation: any;
    public DATA: ComponentModel;
    public label: string;
    public zOrder?: number;
    public category?: string;
}