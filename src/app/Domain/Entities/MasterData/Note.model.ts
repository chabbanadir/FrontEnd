import {AuditableEntity} from "../../Common/AuditableEntity";
import {Status} from "../../Enums/Status";
import {NoteType} from "../../Enums/NoteType";
import {ConfigurationModel} from "./Configuration.model";

export class NoteModel extends AuditableEntity{

    public  name: string;
    public  description: string;
    public  order: number = 0;

    public  noteType: NoteType = NoteType.CONFIG;

    public  status: Status = Status.Active;
/*
    public  config: ConfigurationModel;
*/
}