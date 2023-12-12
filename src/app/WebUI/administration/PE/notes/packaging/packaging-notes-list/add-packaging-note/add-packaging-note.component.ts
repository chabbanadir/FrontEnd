import { Component, OnInit } from '@angular/core';
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {PackageModel} from "../../../../../../../Domain/Entities/MasterData/Package.model";
import {PackagingService} from "../../services/packaging.service";

@Component({
  selector: 'app-add-packaging-note',
  templateUrl: './add-packaging-note.component.html',
  styleUrls: ['./add-packaging-note.component.scss']
})
export class AddPackagingNoteComponent implements OnInit {



  packageNote: PackageModel;
  formData : FormData =  new FormData();
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

      await this._packagingService.CreateAsync(this.packageNote);
      this.packageNote = new PackageModel();
      this.toggleSidebar('add-packaging-note');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {
    this.packageNote = new PackageModel();
  }

  /**
   * status
   *
   */
  status(): typeof Status {
    return Status;
  }



}
