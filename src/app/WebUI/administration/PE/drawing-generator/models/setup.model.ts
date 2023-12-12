import {OemModel} from "../../../../../Domain/Entities/MasterData/Oem.model";
import {HarnessMakerModel} from "../../../../../Domain/Entities/MasterData/HarnessMaker.model";

export class SetupModel {
    public  oems: OemModel[];
    public  harnessMakers: HarnessMakerModel[];
}