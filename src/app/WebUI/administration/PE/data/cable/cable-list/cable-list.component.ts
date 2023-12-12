import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';
import {CoreSidebarService} from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ContentHeader} from "../../../../../layout/components/content-header/content-header.component";
import {CableModel} from "../../../../../../Domain/Entities/MasterData/Cable.model";
import {CableService} from "../services/cable.service";
import {OemService} from "../../oem/services/oem.service";
import {OemModel} from "../../../../../../Domain/Entities/MasterData/Oem.model";
import * as XLSX from 'xlsx';
import { ngxCsv } from 'ngx-csv/ngx-csv';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import 'ag-grid-enterprise';
//import '../styles.css';

// import { ColDef, GridApi, GridReadyEvent } from ;
//import 'ag-grid-community/styles/ag-grid.css';
@Component({
  selector: 'app-cable-list',
  templateUrl: './cable-list.component.html',
  styleUrls: ['./cable-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CableListComponent implements OnInit {
title = 'cableee'
  // public columnDefs: ColDef[] = [
  //   { field: 'athlete', minWidth: 200 },
  //   { field: 'age' },
  //   { field: 'country', minWidth: 200 },
  //   { field: 'year' },
  //   { field: 'date', minWidth: 150 },
  //   { field: 'sport', minWidth: 150 },
  //   { field: 'gold' },
  //   { field: 'silver' },
  // ];
  // public defaultColDef: ColDef = {
  //   sortable: true,
  //   filter: true,
  //   resizable: true,
  //   minWidth: 100,
  //   flex: 1,
  // };
// Private
  private tempData = [];
  fileName= 'ExcelSheet.xlsx';
  // public
  public ems: OemModel[];
  public cables: CableModel[];
  public contentHeader: ContentHeader;
  public selected = [];
  public basicSelectedOption: number = 8;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public editingName = {};
  public SelectionType = SelectionType;
  public exportCSVData;
  public isReload = false;

  data: any[] = [];
  columns: any[];
  footerData: any[][] = [];
  totalSalesAmount = 0;

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
   * @param _cableService
   * @param _coreSidebarService
   * @param _oemService
   * @param modalService
   */
  constructor(private _cableService: CableService,
              private _coreSidebarService: CoreSidebarService,
              private _oemService: OemService,
              private modalService: NgbModal ) {}

  /**
   * ngOnInit
   *
   */
  ngOnInit() {

    this._cableService.onItemsChange.subscribe(res => {
      this.cables = this.exportCSVData = this.tempData = res;
    });

    this._oemService.onItemsChange.subscribe(res => {
      this.ems = res;
    });


    // content header
    this.contentHeader = {
      headerTitle: 'Cables',
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
            name: 'Cables List',
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
    this.cables = this.tempData.filter(function (d:CableModel) {
      let  searchByName = d.name ? d.name.toLowerCase().indexOf(val) !== -1: false;
      let  searchByTEPN = d.tE_PN ? d.tE_PN.toLowerCase().indexOf(val) !== -1: false;
      let  searchByCPN = d.customer_PN ? d.customer_PN.toLowerCase().indexOf(val) !== -1: false;
      return searchByName || searchByTEPN || searchByCPN || !val;
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
    //this.selected.push(...selected);
    this.selected.push(selected);

    this.exportCSVData = selected;
    if (selected.length <= 0) {
      this.exportCSVData = this.cables;
    }

  }


  exportToExcel() {
    let arr = [
      { firstName: 'Jack', lastName: 'Sparrow', email: 'abc@example.com' },
      { firstName: 'Harry', lastName: 'Potter', email: 'abc@example.com' },
    ];
  
    let Heading = [['ID', 'Name', 'CustomerPN', 'TE PN', 'Status']];
  
    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading);
  
    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, this.cables, { origin: 'A2', skipHeader: true });
  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    XLSX.writeFile(wb, 'filename.xlsx');
  }

  //  exportexcel(){
  
  
  // var options ={

  //   fieldSeparator : ',',
  //   quoteStrings: '"',
  //   decimalseparator: '.',
  //   showLabels: true,
  //   showTitle: true,
  //   title: 'Report Data',
  //   useBom :true,
  //   //NoDowload: false,
  //   headers :[ "Name", "CustomerPN", "TE PN", "Status"]

  // };
  // new ngxCsv(this.cables, "Report", options);
  // new ngxCsv(this.cables, "Report 1", options);
  //  }
















//   exportexcel(){
// this.columns = ['Name', 'CustomerPN', 'TE PN', 'Status'];


// }

//   exportexcel(){
//    // let Heading = [['FirstName', 'Last Name', 'Email', 'addresse']];

// /* pass here the table id */
// let element = document.getElementById('excel-table');
// const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

// /* generate workbook and add the worksheet */
// const wb: XLSX.WorkBook = XLSX.utils.book_new();
// XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

// /* save to file */  
// XLSX.writeFile(wb, this.fileName);

//   }









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
    await this._cableService.GetByIdAsync(id);
  }

  /**
   * delete item
   * @param id
   */
  async delete(id) {
    await this._cableService.DeleteAsync(id);
  }


  /**
   * Filter By OEM
   *
   * @param event
   */
  filterByOem(event) {
    this.previousOemIdFilter = event ? event.id : '';
    this.cables = this.filterRows(this.previousOemIdFilter);
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
