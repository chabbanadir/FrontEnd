import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';
import {ContentHeader} from "../../../../../layout/components/content-header/content-header.component";
import {CoreSidebarService} from "../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {HarnessMakerModel} from "../../../../../../Domain/Entities/MasterData/HarnessMaker.model";
import {HarnessMakerService} from "../services/harness-maker.service";

@Component({
  selector: 'app-harness-maker-list',
  templateUrl: './harness-maker-list.component.html',
  styleUrls: ['./harness-maker-list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class HarnessMakerListComponent implements OnInit {


// Private
  private tempData = [];

  // public
  public harnessMakers: HarnessMakerModel[];

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
   * @param _harnessMakerService
   * @param _coreSidebarService
   * @param modalService
   */
  constructor(private _harnessMakerService: HarnessMakerService,
              private _coreSidebarService: CoreSidebarService,
              private modalService: NgbModal ) {
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit() {
    
    this._harnessMakerService.onItemsChange.subscribe(res => {
      this.harnessMakers = this.exportCSVData = this.tempData = res;
     
    });



    // content header
    this.contentHeader = {
      headerTitle: 'Customers Notes',
      actionButton: false, // TODO update actions for fast redirecting
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Dashboard',
            isLink: true,
            link: '/dashboard'
          },
          {
            name: 'Customers Notes List',
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

    this.harnessMakers = this.tempData.filter(function (d) {
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
      this.exportCSVData = this.harnessMakers;
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
    await this._harnessMakerService.GetByIdAsync(id);
  }

  /**
   * delete item
   * @param id
   */
  async delete(id) {
    await this._harnessMakerService.DeleteAsync(id);
  }


}
