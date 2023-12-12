import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';
import {NoteModel} from "../../../../../../Domain/Entities/MasterData/Note.model";
import {ContentHeader} from "../../../../../layout/components/content-header/content-header.component";
import {CoreSidebarService} from "../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {NoteType} from "../../../../../../Domain/Enums/NoteType";
import {ProductionService} from "../services/production.service";

@Component({
  selector: 'app-production-notes-list',
  templateUrl: './production-notes-list.component.html',
  styleUrls: ['./production-notes-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductionNotesListComponent implements OnInit {

// Private
  private tempData = [];

  // public
  public productionNotes: NoteModel[];

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
   * @param _productionService
   * @param _coreSidebarService
   * @param modalService
   */
  constructor(private _productionService: ProductionService,
              private _coreSidebarService: CoreSidebarService,
              private modalService: NgbModal ) {
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit() {

    this._productionService.onItemsChange.subscribe(res => {
      this.productionNotes = res;
      this.productionNotes = this.productionNotes.filter(item=> item.noteType == NoteType.PD);
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

    this.productionNotes = this.tempData.filter(function (d) {
      return d.description.toLowerCase().indexOf(val) !== -1 || !val;
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
      this.exportCSVData = this.productionNotes;
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
    await this._productionService.GetByIdAsync(id);
  }

  /**
   * delete item
   * @param id
   */
  async delete(id) {
    await this._productionService.DeleteAsync(id);
  }
}
