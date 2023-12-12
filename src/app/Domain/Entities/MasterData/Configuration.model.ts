import {AuditableEntity} from "../../Common/AuditableEntity";
import {Status} from "../../Enums/Status";
import {PictureModel} from "./Picture.model";
import {OemModel} from "./Oem.model";
import {Orientation} from "../../Enums/Orientation";
import {NoteModel} from "./Note.model";

export class ConfigurationModel extends AuditableEntity{
    public  name: string;
    public  type: string;
    public  length: number = 0;
    public  position: number = 0;

    public  picture: PictureModel;
    public  oem: OemModel;
    public  note: NoteModel;

    status: Status = Status.Inactive;
    orientation: Orientation = Orientation.Left;
}