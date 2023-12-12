import { Component, OnInit } from '@angular/core';
import {CategoryModel} from "../../../../../../../Domain/Entities/MasterData/Category.model";
import {CategoryService} from "../../../category/services/category.service";
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {HarnessMakerModel} from "../../../../../../../Domain/Entities/MasterData/HarnessMaker.model";
import {HarnessMakerService} from "../../services/harness-maker.service";

@Component({
  selector: 'app-edit-harness-maker',
  templateUrl: './edit-harness-maker.component.html',
  styleUrls: ['./edit-harness-maker.component.scss']
})
export class EditHarnessMakerComponent implements OnInit {


  public harnessMaker: HarnessMakerModel;


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * Constructor
   *
   * @param _harnessMakerService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _harnessMakerService: HarnessMakerService, private _coreSidebarService: CoreSidebarService) {
    this.harnessMaker = new HarnessMakerModel();
  }

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
    this._harnessMakerService.onItemChange.subscribe(res => {
      this.harnessMaker = res;
    });
  }


  /**
   * onSubmit
   */
  async onSubmit(form) {
    if (form.valid) {
      await this._harnessMakerService.UpdateAsync(this.harnessMaker, this.harnessMaker.id);
      this.harnessMaker = new HarnessMakerModel();
      this.toggleSidebar('edit-harnessmaker-sidebar');
    }
  }


  status(): typeof Status{
    return Status;
  }
}
