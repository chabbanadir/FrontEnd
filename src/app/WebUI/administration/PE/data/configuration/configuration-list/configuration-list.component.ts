import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';
import {ContentHeader} from "../../../../../layout/components/content-header/content-header.component";
import {CoreSidebarService} from "../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {ConfigurationModel} from "../../../../../../Domain/Entities/MasterData/Configuration.model";
import {ConfigurationService} from "../services/configuration.service";
import {OemModel} from "../../../../../../Domain/Entities/MasterData/Oem.model";
import {OemService} from "../../oem/services/oem.service";

@Component({
  selector: 'app-configuration-list',
  templateUrl: './configuration-list.component.html',
  styleUrls: ['./configuration-list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ConfigurationListComponent implements OnInit {


  // Private
  private tempData = [];

  // public
  public configurations: ConfigurationModel[];
  public ems: OemModel[];

  // filter
  public rows;
  public tempFilterData;
  public previousOemIdFilter = '';

  public contentHeader: ContentHeader;
  public selected = [];
  public basicSelectedOption: number = 8;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public editingName = {};
  public SelectionType = SelectionType;
  public exportCSVData;
  public isReload = false;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * Constructor
   *
   * @param _configurationService
   * @param _coreSidebarService
   * @param _oemService
   * @param modalService
   */
  constructor(private _configurationService: ConfigurationService,
              private _coreSidebarService: CoreSidebarService,
              private _oemService: OemService,
              private modalService: NgbModal ) {
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit() {

    this._configurationService.onItemsChange.subscribe(res => {
      this.configurations = this.exportCSVData = this.tempData = res;
    });


    this._oemService.onItemsChange.subscribe(res => {
      this.ems = res;
    });



    // content header
    this.contentHeader = {
      headerTitle: 'Configurations',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Dashboard',
            isLink: true,
            link: '/dashboard'
          },
          {
            name: 'Configurations List',
            isLink: false
          }
        ]
      }
    };
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Search (filter)
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    this.configurations = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.table.offset = 0;
  }

  /**
   * For ref only, log selected values
   *
   * @param selected
   */
  onSelect({selected}) {

    this.selected.splice(0, this.selected.length);
    this.selected.push(selected);

    this.exportCSVData = selected;
    if (selected.length <= 0) {
      this.exportCSVData = this.configurations;
    }

  }


  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * modalOpen
   *
   * @param modalDanger
   */
  modalOpen(modalDanger): void {
    this.modalService.open(modalDanger,
        {
          centered: true,
          windowClass: 'modal modal-danger'
        });
  }


  /**
   * Open Edit Oem
   *
   * @param id
   */
  async SelectItem(id) {
    await this._configurationService.GetByIdAsync(id);
  }

  /**
   * delete item
   * @param id
   */
  async delete(id) {
    await this._configurationService.DeleteAsync(id);
  }


  /**
   * Filter By OEM
   *
   * @param event
   */
  filterByOem(event) {
    this.previousOemIdFilter = event ? event.id : '';
    this.configurations = this.filterRows(this.previousOemIdFilter);
  }



  /**
   * Filter Rows
   *
   * @param OemId
   */
  filterRows(OemId): any[] {
    return this.tempData.filter(row => {
      return row.oem.id == OemId || !OemId;
    });
  }
}
