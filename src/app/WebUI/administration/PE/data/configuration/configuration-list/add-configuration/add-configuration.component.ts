import { Component, OnInit } from '@angular/core';
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";

import {ConfigurationModel} from "../../../../../../../Domain/Entities/MasterData/Configuration.model";
import {ConfigurationService} from "../../services/configuration.service";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {OemModel} from "../../../../../../../Domain/Entities/MasterData/Oem.model";
import {OemService} from "../../../oem/services/oem.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Orientation} from "../../../../../../../Domain/Enums/Orientation";
import {ConfigurationNotesService} from "../../../../notes/configuration/services/configuration.service";
import {NoteModel} from "../../../../../../../Domain/Entities/MasterData/Note.model";
import {NoteType} from "../../../../../../../Domain/Enums/NoteType";

@Component({
  selector: 'app-add-configuration',
  templateUrl: './add-configuration.component.html',
  styleUrls: ['./add-configuration.component.scss']
})
export class AddConfigurationComponent implements OnInit {


  configuration: ConfigurationModel;
  ems: OemModel[];
  configNotes: NoteModel[];
  tmp_configNotes: NoteModel[];
  preview: any;
  formData: FormData;

  /**
   * constructor
   * @param _coreSidebarService
   * @param _configurationService
   * @param _oemService
   * @param _configurationNotesService
   * @param sanitizer
   */
  constructor(private _coreSidebarService: CoreSidebarService,
              private _configurationService: ConfigurationService,
              private _oemService: OemService,
              private _configurationNotesService: ConfigurationNotesService,
              private sanitizer: DomSanitizer) {
    this.formData = new FormData();
  }

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



      this.formData.append("name", this.configuration.name);
      this.formData.append("type", this.configuration.type);
      this.formData.append("length", this.configuration.length.toString());
      this.formData.append("position", this.configuration.position.toString());
      this.formData.append("status", this.configuration.status.toString());
      this.formData.append("orientation", this.configuration.orientation.toString());
      this.formData.append("fk_oemId", this.configuration.oem.id);
      this.formData.append("fk_noteId", this.configuration.note.id);

      await this._configurationService.CreateAsync(this.formData);

      this.configuration = new ConfigurationModel();
      this.preview = null;
      this.formData = new FormData();

      this.toggleSidebar('add-configuration-sidebar');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {
    this.configuration = new ConfigurationModel();
    this._oemService.onItemsChange.subscribe(res => {
      this.ems = res;
    });

    this._configurationNotesService.onItemsChange.subscribe((res: NoteModel[]) => {
      this.configNotes = res.filter(item => item.noteType == NoteType.CONFIG);
      this.tmp_configNotes = this.configNotes;
    });
  }

  /**
   * status
   *
   */
  status(): typeof Status {
    return Status;
  }


  /**
   * orientation
   *
   */
  orientation(): typeof Orientation {
    return Orientation;
  }

  filterByName(event){
    this.tmp_configNotes = this.configNotes.filter(data => {
      return data.name.toLowerCase().includes(event.target.value.toLowerCase());
    });
  }


  uploadImage(event: any) {
    if (event.target.files && event.target.files[0])
    {
      if (event.target.files[0].length === 0) {
        return;
      }
      const file = event.target.files[0];

      this.formData.append('file',file);

      this.preview = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
      );


    }
  }
}
