import { DrawingConnectorModel } from "./DrawingConnector.model";
import { BomModel } from "./Bom.model";
import { LeadsModel } from "./Leads.model";
import { PinningSavingModel } from "./PinningSaving.model";
import { AuditableEntity } from "app/Domain/Common/AuditableEntity";

export class DataSavingModel extends AuditableEntity {

    id:string;
    te_pn: string;
    cpn: string;
    project_number : string
    id_oem: string;
    id_harnesmaker: string;
    connectors: DrawingConnectorModel[];
    leads: LeadsModel[];
    pinning: PinningSavingModel[];
    bom: any[];
    c_pdf: any;
    p_pdf: any;
    smartAssembly:any;
    image_drawing: any;
    Rev: string;
    isObsolete: boolean;


}