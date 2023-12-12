import { Component, OnInit } from '@angular/core';
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {CableModel} from "../../../../../../../Domain/Entities/MasterData/Cable.model";
import {CableService} from "../../services/cable.service";
import {OemService} from "../../../oem/services/oem.service";
import {OemModel} from "../../../../../../../Domain/Entities/MasterData/Oem.model";

@Component({
  selector: 'app-edit-cable',
  templateUrl: './edit-cable.component.html',
  styleUrls: ['./edit-cable.component.scss']
})
export class EditCableComponent implements OnInit {


  public cable: CableModel;
  public ems: OemModel[];
  formData : FormData =  new FormData();


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * Constructor
   *
   * @param _cableService
   * @param {CoreSidebarService} _coreSidebarService
   * @param _oemService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
              private _cableService: CableService,
              private _oemService: OemService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------



  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }


  /**
   * On init
   */
  ngOnInit(): void {
    this._cableService.onItemChange.subscribe(res => {
      this.cable = res;
    });

    this._oemService.onItemsChange.subscribe(res => {
      this.ems = res;
    });
  }


  /**
   * onSubmit
   */
  async onSubmit(form) {
    if (form.valid) {

      this.formData.append("id", this.cable.id);
      this.formData.append("name", this.cable.name);
      this.formData.append("fk_oemId", this.cable.oem.id);
      this.formData.append("tE_PN", this.cable.tE_PN);
      this.formData.append("customer_PN", this.cable.customer_PN);
      this.formData.append("description", this.cable.description);
      this.formData.append("status", this.cable.status.toString());

      await this._cableService.UpdateAsync(this.formData, this.cable.id);
      this.cable = new CableModel();
      this.formData = new FormData();
      this.toggleSidebar('edit-cable-sidebar');
    }
  }


  status(): typeof Status{
    return Status;
  }


}
