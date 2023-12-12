import { Component, OnInit } from '@angular/core';
import {PackageModel} from "../../../../../../../Domain/Entities/MasterData/Package.model";
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {PackagingService} from "../../services/packaging.service";
import {Status} from "../../../../../../../Domain/Enums/Status";

@Component({
  selector: 'app-edit-packaging-note',
  templateUrl: './edit-packaging-note.component.html',
  styleUrls: ['./edit-packaging-note.component.scss']
})
export class EditPackagingNoteComponent implements OnInit {


  packageNote: PackageModel;

  /**
   * constructor
   * @param _coreSidebarService
   * @param _packagingService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
              private _packagingService: PackagingService) {}

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

      await this._packagingService.UpdateAsync(this.packageNote,this.packageNote.id);
      this.packageNote = new PackageModel();
      this.toggleSidebar('edit-packaging-note');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {
    this._packagingService.onItemChange.subscribe(res => {
      this.packageNote = res;
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
