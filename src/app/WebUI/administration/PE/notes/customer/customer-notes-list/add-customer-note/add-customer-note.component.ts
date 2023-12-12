import { Component, OnInit } from '@angular/core';
import {NoteModel} from "../../../../../../../Domain/Entities/MasterData/Note.model";
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {CustomerService} from "../../services/customer.service";
import {NoteType} from "../../../../../../../Domain/Enums/NoteType";

@Component({
  selector: 'app-add-customer-note',
  templateUrl: './add-customer-note.component.html',
  styleUrls: ['./add-customer-note.component.scss']
})
export class AddCustomerNoteComponent implements OnInit {


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

      this.formData.append("description", this.customerNote.description);
      this.formData.append("noteType", NoteType.CD.toString());
      this.formData.append("order", this.customerNote.order.toString());
      this.formData.append("status", this.customerNote.status.toString());


      await this._customerService.CreateAsync(this.formData);
      this.formData = new FormData();
      this.customerNote = new NoteModel();
      this.toggleSidebar('add-customer-note');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {
    this.customerNote = new NoteModel();
  }

  /**
   * status
   *
   */
  status(): typeof Status {
    return Status;
  }






}
