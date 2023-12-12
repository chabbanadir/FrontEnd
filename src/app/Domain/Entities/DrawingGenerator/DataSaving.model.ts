import { DrawingConnectorModel } from "./DrawingConnector.model";
import { BomModel } from "./Bom.model";
import { LeadsModel } from "./Leads.model";
import { PinningSavingModel } from "./PinningSaving.model";

export class DataSavingModel {

    te_pn: string;
    cpn: string;
    project_number : string
    id_oem: string;
    id_harnesmaker: string;
    connectors: DrawingConnectorModel[];
    leads: LeadsModel[];
    pinning: PinningSavingModel[];
    bom: BomModel[];
    c_pdf: File;
    p_pdf: File;
    image_drawing: File;
    isObsolete: boolean;

}