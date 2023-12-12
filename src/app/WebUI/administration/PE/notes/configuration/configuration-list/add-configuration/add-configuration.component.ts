import {Component, OnInit} from '@angular/core';
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";

import {Status} from "../../../../../../../Domain/Enums/Status";
import {NoteModel} from "../../../../../../../Domain/Entities/MasterData/Note.model";
import {ConfigurationNotesService} from "../../services/configuration.service";
import {CategoryService} from "../../../../data/category/services/category.service";
import {CategoryModel} from "../../../../../../../Domain/Entities/MasterData/Category.model";
import {ConfigurationModel} from "../../../../../../../Domain/Entities/MasterData/Configuration.model";
import {ConfigurationService} from "../../../../data/configuration/services/configuration.service";

@Component({
  selector: 'app-add-configuration',
  templateUrl: './add-configuration.component.html',
  styleUrls: ['./add-configuration.component.scss']
})
export class AddConfigurationComponent implements OnInit {

  configurationNote: NoteModel;
  configurations: ConfigurationModel[];
  formData : FormData =  new FormData();
  /**
   * constructor
   * @param _coreSidebarService
   * @param _configurationNotesService
   * @param _configurationService
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
      this.formData.append("name", this.configurationNote.name);
      this.formData.append("description", this.configurationNote.description);
/*
      this.formData.append("fk_configId", this.configurationNote.config.id);
*/
      this.formData.append("noteType", this.configurationNote.noteType.toString());
      this.formData.append("status", this.configurationNote.status.toString());


       await this._configurationNotesService.CreateAsync(this.formData);
       this.formData = new FormData();
       this.configurationNote = new NoteModel();
      this.toggleSidebar('add-configuration-sidebar');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {
    this.configurationNote = new NoteModel();
  }

  /**
   * status
   *
   */
  status(): typeof Status {
    return Status;
  }








}
