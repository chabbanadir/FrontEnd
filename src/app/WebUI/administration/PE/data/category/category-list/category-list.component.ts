import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';
import {Subject} from 'rxjs';
import {CoreSidebarService} from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ContentHeader} from "../../../../../layout/components/content-header/content-header.component";
import {CategoryService} from "../services/category.service";
import {CategoryModel} from "../../../../../../Domain/Entities/MasterData/Category.model";
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryListComponent implements OnInit {

  fileName= 'ExcelSheet.xlsx';
// Private
  private _unsubscribeAll: Subject<any>;
  private tempData = [];

  // public
  public contentHeader: ContentHeader;
  public selected = [];
  public categories: CategoryModel[];
  public basicSelectedOption: number = 8;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public editingName = {};
  public SelectionType = SelectionType;
  public exportCSVData;
  public isReload = false;


 

    // filter
  public rows;
  public tempFilterData;
  public previousOemIdFilter = '';


  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * Constructor
   *
   * @param _categoryService
   * @param _coreSidebarService
   * @param modalService
   */
  constructor(private _categoryService: CategoryService,
              private _coreSidebarService: CoreSidebarService,
              private modalService: NgbModal ) {
    this._unsubscribeAll = new Subject();
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit() {
   
    this._categoryService.onItemsChange.subscribe(res => {
      this.categories = this.exportCSVData = this.tempData = res;
      
    });



    // content header
    this.contentHeader = {
      headerTitle: 'Categories',
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
            name: 'Categories List',
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

    this.categories = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.table.offset = 0;
  }

//   exportexcel(){
//    // let Heading = [['FirstName', 'Last Name', 'Email', 'addresse']];

// /* pass here the table id */
// let categories = document.getElementsByClassName('excel-table');
// const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(this.categories);

// /* generate workbook and add the worksheet */
// const wb: XLSX.WorkBook = XLSX.utils.book_new();
// XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

// /* save to file */  
// XLSX.writeFile(wb, this.fileName);

//   }


sheet_data_1 = [
  {
    ID: 10011,
    NAME: 'A',
    DEPARTMENT: 'Sales',
    MONTH: 'Jan',
    YEAR: 2022,
    SALES: 132412,
    CHANGE: 12,
    LEADS: 35,
  },
  {
    ID: 10012,
    NAME: 'A',
    DEPARTMENT: 'Sales',
    MONTH: 'Feb',
    YEAR: 2022,
    SALES: 232324,
    CHANGE: 2,
    LEADS: 443,
  },
  {
    ID: 10013,
    NAME: 'A',
    DEPARTMENT: 'Sales',
    MONTH: 'Mar',
    YEAR: 2022,
    SALES: 542234,
    CHANGE: 45,
    LEADS: 345,
  },
];
sheet_data_2 = [
  {
    ID: 10014,
    NAME: 'A',
    DEPARTMENT: 'Sales',
    MONTH: 'Apr',
    YEAR: 2022,
    SALES: 223335,
    CHANGE: 32,
    LEADS: 234,
  },
  {
    ID: 10015,
    NAME: 'A',
    DEPARTMENT: 'Sales',
    MONTH: 'May',
    YEAR: 2022,
    SALES: 455535,
    CHANGE: 21,
    LEADS: 12,
  },
];


exportToExcel() {
  let arr = [
    { firstName: 'Jack', lastName: 'Sparrow', email: 'abc@example.com' },
    { firstName: 'Harry', lastName: 'Potter', email: 'abc@example.com' },
  ];

  

  let Heading = [['ID', 'Name', 'Status', 'actions']];

  //Had to create a new workbook and then add the header
  const wb = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.sheet_add_aoa(ws, Heading);

  //Starting in the second row to avoid overriding and skipping headers
  XLSX.utils.sheet_add_json(ws, this.categories, { origin: 'A2', skipHeader: true });

  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  XLSX.writeFile(wb, 'filename.xlsx');
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
      this.exportCSVData = this.categories;
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
    await this._categoryService.GetByIdAsync(id);
  }

  /**
   * delete item
   * @param id
   */
  async delete(id) {
    await this._categoryService.DeleteAsync(id);
  }
}
