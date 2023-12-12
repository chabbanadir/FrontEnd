import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';
import {NoteModel} from "../../../../../../Domain/Entities/MasterData/Note.model";
import {ContentHeader} from "../../../../../layout/components/content-header/content-header.component";
import {CoreSidebarService} from "../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {NoteType} from "../../../../../../Domain/Enums/NoteType";
import {CustomerService} from "../services/customer.service";

@Component({
  selector: 'app-customer-notes-list',
  templateUrl: './customer-notes-list.component.html',
  styleUrls: ['./customer-notes-list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CustomerNotesListComponent implements OnInit {


// Private
  private tempData = [];

  // public
  public customerNotes: NoteModel[];

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
   * @param _customerService
   * @param _coreSidebarService
   * @param modalService
   */
  constructor(private _customerService: CustomerService,
              private _coreSidebarService: CoreSidebarService,
              private modalService: NgbModal ) {
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit() {

    this._customerService.onItemsChange.subscribe(res => {
      this.customerNotes = res;
      this.customerNotes = this.customerNotes.filter(item=> item.noteType == NoteType.CD);
      this.exportCSVData = res;
    });



    // content header
    this.contentHeader = {
      headerTitle: 'Customer',
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
            name: 'Customer Notes',
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

    this.customerNotes = this.tempData.filter(function (d) {
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
    //this.selected.push(...selected); abda

    this.exportCSVData = selected;
    if (selected.length <= 0) {
      this.exportCSVData = this.customerNotes;
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
    await this._customerService.GetByIdAsync(id);
  }

  /**
   * delete item
   * @param id
   */
  async delete(id) {
    await this._customerService.DeleteAsync(id);
  }
}
