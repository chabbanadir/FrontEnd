import { Component, OnInit } from '@angular/core';
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {Status} from "../../../../../../../Domain/Enums/Status";
import {ComponentModel} from "../../../../../../../Domain/Entities/MasterData/Component.model";
import {ComponentService} from "../../services/component.service";
import {CategoryModel} from "../../../../../../../Domain/Entities/MasterData/Category.model";
import {OemModel} from "../../../../../../../Domain/Entities/MasterData/Oem.model";
import {ConfigurationModel} from "../../../../../../../Domain/Entities/MasterData/Configuration.model";
import {CableModel} from "../../../../../../../Domain/Entities/MasterData/Cable.model";
import {CategoryService} from "../../../category/services/category.service";
import {OemService} from "../../../oem/services/oem.service";
import {ConfigurationService} from "../../../configuration/services/configuration.service";
import {CableService} from "../../../cable/services/cable.service";
import {DomSanitizer} from "@angular/platform-browser";
import {PictureModel} from "../../../../../../../Domain/Entities/MasterData/Picture.model";
import {environment} from "../../../../../../../../environments/environment";
import {Orientation} from "../../../../../../../Domain/Enums/Orientation";

@Component({
  selector: 'app-edit-component',
  templateUrl: './edit-component.component.html',
  styleUrls: ['./edit-component.component.scss']
})
export class EditComponentComponent implements OnInit {

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
              private sanitizer: DomSanitizer) {}

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
      this.formData.append("id", this.component.id);
      this.formData.append("name", this.component.name);
      this.formData.append("tE_PN", this.component.tE_PN|| null);
      this.formData.append("customer_PN", this.component.customer_PN || null);
      this.formData.append("pdM_LINK_PN", this.component.pdM_LINK_PN|| null);
      this.formData.append("showIn", this.component.showIn.toString());
      this.formData.append("status", this.component.status.toString());
      this.formData.append("fk_oemId", this.component.fK_OemId);
      this.formData.append("fk_categoryId", this.component.fK_CategoryId);

      await this._componentService.UpdateAsync(this.formData,this.component.id);

      this.component = new ComponentModel();
      this.formData = new  FormData();
      this.preview = null;
      this.toggleSidebar('edit-component-sidebar');
    }
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit(): void {
/*
    this.component = new ComponentModel();
*/

    this._componentService.onItemChange.subscribe(res => {
      this.component = res;
    });


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


  getCDN(pic: PictureModel) {
    if(!pic) return false;
    return environment.cdnUrl +pic.picPath;
  }

}
