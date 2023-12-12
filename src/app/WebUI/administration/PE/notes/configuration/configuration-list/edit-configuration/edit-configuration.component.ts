import { Component, OnInit } from '@angular/core';
import {NoteModel} from "../../../../../../../Domain/Entities/MasterData/Note.model";
import {CategoryModel} from "../../../../../../../Domain/Entities/MasterData/Category.model";
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {ConfigurationNotesService} from "../../services/configuration.service";
import {CategoryService} from "../../../../data/category/services/category.service";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {ConfigurationService} from "../../../../data/configuration/services/configuration.service";
import {ConfigurationModel} from "../../../../../../../Domain/Entities/MasterData/Configuration.model";

@Component({
  selector: 'app-edit-configuration',
  templateUrl: './edit-configuration.component.html',
  styleUrls: ['./edit-configuration.component.scss']
})
export class EditConfigurationComponent implements OnInit {


  configurationNote: NoteModel;
  configurations: ConfigurationModel[];
  formData : FormData =  new FormData();
  /**
   * constructor
   * @param _coreSidebarService
   * @param _configurationNotesService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
              private _configurationNotesService: ConfigurationNotesService) {}

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

      this.formData.append("id", this.configurationNote.id);
      this.formData.append("name", this.configurationNote.name);
      this.formData.append("description", this.configurationNote.description);
/*
      this.formData.append("fk_configId", this.configurationNote.config.id);
*/
      this.formData.append("noteType", this.configurationNote.noteType.toString());
      this.formData.append("order", this.configurationNote.order.toString());
      this.formData.append("status", this.configurationNote.status.toString());

      await this._configurationNotesService.UpdateAsync(this.formData,this.configurationNote.id);
      this.formData = new FormData();
      this.toggleSidebar('edit-configuration-sidebar');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {

    this._configurationNotesService.onItemChange.subscribe(res => {
      this.configurationNote = res;
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
