import { Component, OnInit } from '@angular/core';
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {CableModel} from "../../../../../../../Domain/Entities/MasterData/Cable.model";
import {CableService} from "../../services/cable.service";
import {OemService} from "../../../oem/services/oem.service";
import {OemModel} from "../../../../../../../Domain/Entities/MasterData/Oem.model";

@Component({
  selector: 'app-add-cable',
  templateUrl: './add-cable.component.html',
  styleUrls: ['./add-cable.component.scss']
})
export class AddCableComponent implements OnInit {

  cable: CableModel;
  ems: OemModel[];
  formData : FormData =  new FormData();
  /**
   * constructor
   * @param _coreSidebarService
   * @param _cableService
   * @param _oemService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
              private _cableService: CableService,
              private _oemService: OemService) {}

  /**
   * toggleSidebar
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * submit
   * @param form
   */
  async submit(form) {
    if (form.valid)
    {


      this.formData.append("name", this.cable.name);
      this.formData.append("fk_oemId", this.cable.oem.id);
      this.formData.append("tE_PN", this.cable.tE_PN);
      this.formData.append("customer_PN", this.cable.customer_PN);
      this.formData.append("description", this.cable.description);
      this.formData.append("status", this.cable.status.toString());


      await this._cableService.CreateAsync(this.formData);
      this.cable = new CableModel();
      this.formData = new FormData();
      this.toggleSidebar('add-cable-sidebar');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {
    this.cable = new CableModel();

    this._oemService.onItemsChange.subscribe(res => {
      this.ems = res;
    });
  }

  /**
   * status
   *
   */
  status(): typeof Status {
    return Status;
  }
}
