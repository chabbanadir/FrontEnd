import { Component, OnInit } from '@angular/core';
import {NoteModel} from "../../../../../../../Domain/Entities/MasterData/Note.model";
import {CategoryModel} from "../../../../../../../Domain/Entities/MasterData/Category.model";
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {CustomerService} from "../../services/customer.service";
import {NoteType} from "../../../../../../../Domain/Enums/NoteType";
import {Status} from "../../../../../../../Domain/Enums/Status";

@Component({
  selector: 'app-edit-customer-note',
  templateUrl: './edit-customer-note.component.html',
  styleUrls: ['./edit-customer-note.component.scss']
})
export class EditCustomerNoteComponent implements OnInit {



  customerNote: NoteModel;
  formData : FormData =  new FormData();
  /**
   * constructor
   * @param _coreSidebarService
   * @param _customerService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
              private _customerService: CustomerService) {}

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

      this.formData.append("id", this.customerNote.id);
      this.formData.append("description", this.customerNote.description);
      this.formData.append("noteType", NoteType.CD.toString());
      this.formData.append("order", this.customerNote.order.toString());
      this.formData.append("status", this.customerNote.status.toString());


      await this._customerService.UpdateAsync(this.formData,this.customerNote.id);
      this.formData = new FormData();
      this.customerNote = new NoteModel();
      this.toggleSidebar('edit-customer-note');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {
    this._customerService.onItemChange.subscribe(res => {
      this.customerNote = res;
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
