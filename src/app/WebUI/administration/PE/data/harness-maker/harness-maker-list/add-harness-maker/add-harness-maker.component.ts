import { Component, OnInit } from '@angular/core';
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {HarnessMakerModel} from "../../../../../../../Domain/Entities/MasterData/HarnessMaker.model";
import {HarnessMakerService} from "../../services/harness-maker.service";

@Component({
  selector: 'app-add-harness-maker',
  templateUrl: './add-harness-maker.component.html',
  styleUrls: ['./add-harness-maker.component.scss']
})
export class AddHarnessMakerComponent implements OnInit {
  harnessmaker: HarnessMakerModel;

  /**
   * constructor
   * @param _coreSidebarService
   * @param _harnessMakerService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
              private _harnessMakerService: HarnessMakerService) {}

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
      await this._harnessMakerService.CreateAsync(this.harnessmaker);
      this.harnessmaker = new HarnessMakerModel();
      this.toggleSidebar('add-harnessmaker-sidebar');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {
    this.harnessmaker = new HarnessMakerModel();
  }

  /**
   * status
   *
   */
  status(): typeof Status {
    return Status;
  }
}
