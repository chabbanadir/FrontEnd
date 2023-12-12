import { Component, OnInit } from '@angular/core';
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {ComponentModel} from "../../../../../../../Domain/Entities/MasterData/Component.model";
import {ComponentService} from "../../services/component.service";
import {CategoryService} from "../../../category/services/category.service";
import {CategoryModel} from "../../../../../../../Domain/Entities/MasterData/Category.model";
import {OemService} from "../../../oem/services/oem.service";
import {OemModel} from "../../../../../../../Domain/Entities/MasterData/Oem.model";
import {ConfigurationService} from "../../../configuration/services/configuration.service";
import {ConfigurationModel} from "../../../../../../../Domain/Entities/MasterData/Configuration.model";
import {CableService} from "../../../cable/services/cable.service";
import {CableModel} from "../../../../../../../Domain/Entities/MasterData/Cable.model";
import {DomSanitizer} from "@angular/platform-browser";
import {Orientation} from "../../../../../../../Domain/Enums/Orientation";

@Component({
  selector: 'app-add-component',
  templateUrl: './add-component.component.html',
  styleUrls: ['./add-component.component.scss']
})
export class AddComponentComponent implements OnInit {

  component: ComponentModel;

  categories: CategoryModel[];
  ems: OemModel[];
  configurations: ConfigurationModel[];
  cables: CableModel[];


  temp_configs: ConfigurationModel[];
  temp_cables: CableModel[];

  formData :FormData =  new FormData();
  preview: any;

  /**
   * constructor
   * @param _coreSidebarService
   * @param _componentService
   * @param _categoryService
   * @param _oemService
   * @param _configurationService
   * @param _cableService
   * @param sanitizer
   */
  constructor(private _coreSidebarService: CoreSidebarService,
              private _componentService: ComponentService,
              private _categoryService: CategoryService,
              private _oemService: OemService,
              private _configurationService: ConfigurationService,
              private _cableService: CableService,
              private sanitizer: DomSanitizer) {
    console.log("const");
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
      this.formData.append("name", this.component.name);
      this.formData.append("tE_PN", this.component.tE_PN|| null);
      this.formData.append("customer_PN", this.component.customer_PN || null);
      this.formData.append("pdM_LINK_PN", this.component.pdM_LINK_PN|| null);
      this.formData.append("showIn", this.component.showIn.toString());
      this.formData.append("status", this.component.status.toString());
      this.formData.append("fk_oemId", this.component.fK_OemId);
      this.formData.append("fk_categoryId", this.component.fK_CategoryId);

      /*
            this.formData.append("rev", this.component.rev|| null);
            this.formData.append("description", this.component.description|| null);
            this.formData.append("length", this.component.length.toString());
            this.formData.append("position", this.component.position.toString());*/
      /*
      this.formData.append("orientation", this.component.orientation.toString());
*/
      /*
      if(this.hasConfig(this.component.fK_CategoryId))
      {
        this.formData.append("fk_configId", this.component.fK_ConfigId);
      }

      if(this.hasCable(this.component.fK_CategoryId))
      {
        this.formData.append("fk_cableId", this.component.fK_CableId);
      }
*/

      await this._componentService.CreateAsync(this.formData);

      this.component = new ComponentModel();
      this.formData = new  FormData();
      this.preview = null;
      this.toggleSidebar('add-component-sidebar');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {
    console.log("init");
    this.component = new ComponentModel();

    this._categoryService.onItemsChange.subscribe(res => {
      this.categories = res;
    });

    this._oemService.onItemsChange.subscribe(res => {
      this.ems = res;
    });

    this._configurationService.onItemsChange.subscribe(res => {
      this.configurations = res;
    });

    this._cableService.onItemsChange.subscribe(res => {
      this.cables = res;
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


  filterSelects(){
   this.temp_configs = this.configurations;
   this.temp_configs = this.temp_configs.filter(item => item.oem.id == this.component.fK_OemId);


   this.temp_cables = this.cables;
   this.temp_cables = this.temp_cables.filter(item => item.oem.id == this.component.fK_OemId);

    //this.component.cable = null;
    this.component.config = null;
  }




/*  uploadImage(event: any) {
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
  }*/

/*  hasConfig(id){
    return this.categories.find(item => item.id == id).hasConfig;
  }

  hasCable(id){
    return this.categories.find(item => item.id == id).hasCable;
  }*/
}
