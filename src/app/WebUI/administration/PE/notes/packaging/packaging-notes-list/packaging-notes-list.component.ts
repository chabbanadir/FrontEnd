import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';
import {ContentHeader} from "../../../../../layout/components/content-header/content-header.component";
import {CoreSidebarService} from "../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {PackageModel} from "../../../../../../Domain/Entities/MasterData/Package.model";
import {PackagingService} from "../services/packaging.service";


@Component({
  selector: 'app-packaging-notes-list',
  templateUrl: './packaging-notes-list.component.html',
  styleUrls: ['./packaging-notes-list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class PackagingNotesListComponent implements OnInit {



  // Private
    private tempData = [];

  // public
  public packagesNotes: PackageModel[];

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
   * @param _packageService
   * @param _coreSidebarService
   * @param modalService
   */
  constructor(private _packageService: PackagingService,
              private _coreSidebarService: CoreSidebarService,
              private modalService: NgbModal ) {
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit() {

    this._packageService.onItemsChange.subscribe(res => {
      this.packagesNotes = this.exportCSVData = this.tempData = res;
      
    });



    // content header
    this.contentHeader = {
      headerTitle: 'Package',
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
            name: 'Packages Notes',
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
    this.packagesNotes = this.tempData.filter(function (d:PackageModel) {
      let  searchByLayer = d.layer ? d.layer.toLowerCase().indexOf(val) !== -1: false;
      let  searchByPN = d.pn ? d.pn.toLowerCase().indexOf(val) !== -1: false;
      return searchByLayer || searchByPN || !val;
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
    //this.selected.push(...selected);

    this.exportCSVData = selected;
    if (selected.length <= 0) {
      this.exportCSVData = this.packagesNotes;
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
    await this._packageService.GetByIdAsync(id);
  }

  /**
   * delete item
   * @param id
   */
  async delete(id) {
    await this._packageService.DeleteAsync(id);
  }
}
