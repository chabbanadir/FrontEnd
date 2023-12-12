import { Component, OnInit } from '@angular/core';
import {NoteModel} from "../../../../../../../Domain/Entities/MasterData/Note.model";
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {NoteType} from "../../../../../../../Domain/Enums/NoteType";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {ProductionService} from "../../services/production.service";

@Component({
  selector: 'app-add-production-note',
  templateUrl: './add-production-note.component.html',
  styleUrls: ['./add-production-note.component.scss']
})
export class AddProductionNoteComponent implements OnInit {


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

      this.formData.append("description", this.productionNote.description);
      this.formData.append("noteType", NoteType.PD.toString());
      this.formData.append("order", this.productionNote.order.toString());
      this.formData.append("status", this.productionNote.status.toString());


      await this._productionService.CreateAsync(this.formData);
      this.formData = new FormData();
      this.productionNote = new NoteModel();
      this.toggleSidebar('add-production-note');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {
    this.productionNote = new NoteModel();
  }

  /**
   * status
   *
   */
  status(): typeof Status {
    return Status;
  }





}
