import { Component, OnInit } from '@angular/core';
import {NoteModel} from "../../../../../../../Domain/Entities/MasterData/Note.model";
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";

import {NoteType} from "../../../../../../../Domain/Enums/NoteType";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {ProductionService} from "../../services/production.service";

@Component({
  selector: 'app-edit-production-note',
  templateUrl: './edit-production-note.component.html',
  styleUrls: ['./edit-production-note.component.scss']
})
export class EditProductionNoteComponent implements OnInit {



  productionNote: NoteModel;
  formData : FormData =  new FormData();
  /**
   * constructor
   * @param _coreSidebarService
   * @param _productionService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
              private _productionService: ProductionService) {}

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

      // this.configurationNote.noteType = NoteType.CONFIG;

      this.formData.append("id", this.productionNote.id);
      this.formData.append("description", this.productionNote.description);
      this.formData.append("noteType", NoteType.PD.toString());
      this.formData.append("order", this.productionNote.order.toString());
      this.formData.append("status", this.productionNote.status.toString());


      await this._productionService.UpdateAsync(this.formData,this.productionNote.id);
      this.formData = new FormData();
      this.productionNote = new NoteModel();
      this.toggleSidebar('edit-production-note');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {
    this._productionService.onItemChange.subscribe(res => {
      this.productionNote = res;
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
