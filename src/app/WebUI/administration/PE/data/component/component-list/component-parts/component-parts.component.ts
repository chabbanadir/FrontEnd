import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ComponentModel} from "../../../../../../../Domain/Entities/MasterData/Component.model";
import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {ComponentService} from "../../services/component.service";
import {PartModel} from "../../../../../../../Domain/Entities/MasterData/Part.model";
import {repeaterAnimation} from "./animation/repeaterAnimation";


@Component({
  selector: 'app-component-parts',
  templateUrl: './component-parts.component.html',
  styleUrls: ['./component-parts.component.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.Emulated
})
export class ComponentPartsComponent implements OnInit{


  public component: ComponentModel;
  public components: ComponentModel[];

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param _componentService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
              private _componentService: ComponentService) {}



  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------


  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }




  /**
   * On init
   */
  ngOnInit(): void
  {
    this._componentService.onItemChange.subscribe(res => {
      this.component = res;
    });

    this._componentService.onItemsChange.subscribe(res => {
      this.components = res;
    });
  }


  async SaveAll() {
      for (const element of this.component.parts)
      {
        await this._componentService.UpdatePartAsync(element, this.component.id);
      }

    this.toggleSidebar('component-parts-sidebar');

  }

  async detach(item) {
        var formData = new FormData();
        formData.append("id", item.id);
        await this._componentService.DeletePartAsync(item.id,this.component.id);
  }


  async CreatePART() {
    var formData = new FormData();
    formData.append("fk_ComponentId", this.component.id);
    await this._componentService.CreatePartAsync(formData,this.component.id);
  }



}
