import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, SelectionType} from '@swimlane/ngx-datatable';
import {Subject} from "rxjs";
import {ContentHeader} from "../../../../../layout/components/content-header/content-header.component";
import {CoreSidebarService} from "../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ComponentModel} from "../../../../../../Domain/Entities/MasterData/Component.model";
import {ComponentService} from "../services/component.service";
import {OemModel} from "../../../../../../Domain/Entities/MasterData/Oem.model";
import {CategoryModel} from "../../../../../../Domain/Entities/MasterData/Category.model";

import {CableModel} from "../../../../../../Domain/Entities/MasterData/Cable.model";
import {CategoryService} from "../../category/services/category.service";
import {OemService} from "../../oem/services/oem.service";

import { Workbook } from 'exceljs';
import {CableService} from "../../cable/services/cable.service";
import {ComponentDetailComponent} from "./component-detail/component-detail.component";
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ComponentListComponent implements OnInit {
  fileName= 'ExcelSheet.xlsx';
// Private
  private _unsubscribeAll: Subject<any>;
  private tempData = [];

  // public
  public components: ComponentModel[];
  public ems: OemModel[];
  public categories: CategoryModel[];
  public cables: CableModel[];
  public selectedId: string;
  public contentHeader: ContentHeader;
  public selected = [];
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
  public previousCategoryIdFilter = '';

  title = 'angular-export-to-excel';

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

  sheet_data4 = [
    {
      "General Formation" :"ID",
      "Assembly Name/PN : ": 'TE5551233551',
      "Customer P/N : ": 'TEXXXXXX123',
      "Customer Code : ": 'Jan',
      "Drawing Information : " : 1,
      "Drawing Size : ": 2022,
      "Drawing Notes: : ": 132412,
      "Packing Note : ": 12,
      "Coil Diameter (mm) : ": 35,
      "Customer Drawing : ": 111,
    },
    {
      "General Formation" :"ID",
      "Assembly Name/PN : ": 'TE5551233551',
      "Customer P/N : ": 'TEXXXXXX123',
      "Customer Code : ": 'Jan',
      "Drawing Information : " : 1,
      "Drawing Size : ": 2022,
      "Drawing Notes: : ": 132412,
      "Packing Note : ": 12,
      "Coil Diameter (mm) : ": 35,
    },
    {
      "General Formation" :"ID",
      "Assembly Name/PN : ": 'TE5551233551',
      "Customer P/N : ": 'TEXXXXXX123',
      "Customer Code : ": 'Jan',
      "Drawing Information : " : 1,
      "Drawing Size : ": 2022,
      "Drawing Notes: : ": 132412,
      "Packing Note : ": 12,
      "Coil Diameter (mm) : ": 35,
    },
  ];
  
  // sheet_data4 = [
  //   {
  //     ID: 10014,
  //     NAME: 'A',
  //     DEPARTMENT: 'Sales',
  //     MONTH: 'Apr',
  //     YEAR: 2022,
  //     SALES: 223335,
  //     CHANGE: 32,
  //     LEADS: 234,
  //   },
  //   {
  //     ID: 10015,
  //     NAME: 'A',
  //     DEPARTMENT: 'Sales',
  //     MONTH: 'May',
  //     YEAR: 2022,
  //     SALES: 455535,
  //     CHANGE: 21,
  //     LEADS: 12,
  //   },
  // ];
  sheet_data5 = [
    {
      " ": "1",
      Position:'',
      X: '',
      Y:'',
      Z: '',
    },
   
  ];
  sheet_data6 = [
   
    {
      "Sr. No.": 1,
      "":'',


      From: '',
      " ":'',
      To: '',
    },
  ];
  sheet_data7 = [
    {
      ID: 10014,

      Table_Single_to_Single: 'A',
      Table_Multiple_to_Single_POS_2_Left: 'Con_1_Pos_1, Con_1_Pos_1 ',
      Table_Multiple_to_Single_POS_2_Right: 'Apr',
      Table_Multiple_to_Single_POS_3_Left: 2022,
      Table_Multiple_to_Single_POS_3_Right: 223335,
      Table_Multiple_to_Single_POS_4_Left: 223335,
      Table_Multiple_to_Single_POS_4_Right: 223335,
      Table_Multiple_to_Multiple_POS_2: 223335,
      Table_Multiple_to_Multiple_POS_3: 223335,
      Table_Multiple_to_Multiple_POS_4: 223335,
      Table_General: 32,
      //LEADS: 234,
    },
  ];
  sheet_data8 = [
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

  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * Constructor
   *
   * @param _categoryService
   * @param _componentService
   * @param _oemService
   * @param _coreSidebarService
   * @param modalService
   */
  constructor(private _componentService: ComponentService,
              private _categoryService: CategoryService,
              private _oemService: OemService,
              private _coreSidebarService: CoreSidebarService,
              private modalService: NgbModal ) {
    this._unsubscribeAll = new Subject();
  }

  /**
   * ngOnInit
   *
   */
  ngOnInit() {

    this._componentService.onItemsChange.subscribe(res => {
      this.components = this.exportCSVData = this.tempData = res;
    });

    this._oemService.onItemsChange.subscribe(res => {
      this.ems = res;
    });

    this._categoryService.onItemsChange.subscribe(res => {
      this.categories = res;
    });

    // content header
    this.contentHeader = {
      headerTitle: 'Components',
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
            name: 'Components List',
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
    this.components = this.tempData.filter(function (d:ComponentModel) {
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
   // this.selected.push(...selected);
    this.selected.push(selected);

    this.exportCSVData = selected;
    if (selected.length <= 0) {
      this.exportCSVData = this.components;
    }

  }




  exportToExcel() {
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Cable Harness Configuration');
    let worksheet_2 = workbook.addWorksheet('P-DRAWING BOM');
    let worksheet3 = workbook.addWorksheet('MODEL BOM');
    let worksheet4 = workbook.addWorksheet('C-DRAWING BOM');
    let worksheet5 = workbook.addWorksheet('Co-ordinates_Points');
    let worksheet6 = workbook.addWorksheet('Pin Out Chart General');
    let worksheet7 = workbook.addWorksheet('General Lists');
    let worksheet8 = workbook.addWorksheet('Reference');

    //Add Row and formatting
    worksheet.mergeCells('C1', 'F1');
    worksheet.getCell('C1').value = 'Cable Harness Configuration';
    worksheet_2.mergeCells('C1', 'F1');
    worksheet_2.getCell('C1').value = 'P-DRAWING BOM';
    worksheet3.mergeCells('C1', 'F1');
    worksheet3.getCell('C1').value = 'MODEL BOM';
    worksheet4.mergeCells('C1', 'F1');
    worksheet4.getCell('C1').value = 'C-DRAWING BOM';
    worksheet5.mergeCells('C1', 'F1');
    worksheet5.getCell('C1').value = 'Co-ordinates_Points';
    worksheet6.mergeCells('C1', 'F1');
    worksheet6.getCell('C1').value = 'Pin Out Chart General';
    worksheet7.mergeCells('C1', 'F1');
    worksheet7.getCell('C1').value = 'General Lists';
    worksheet8.mergeCells('C1', 'F1');
    worksheet8.getCell('C1').value = 'Reference';
    // Add Header Rows
    worksheet.addRow(Object.keys(this.sheet_data_1[0]));
    worksheet_2.addRow(Object.keys(this.sheet_data_2[0]));
    //worksheet3.addRow(Object.keys(this.sheet_data3[0]));
    worksheet3.addRow(Object.keys(this.components[0]));  
    worksheet4.addRow(Object.keys(this.sheet_data4[0]));   
    worksheet5.addRow(Object.keys(this.sheet_data5[0])); 
    worksheet6.addRow(Object.keys(this.sheet_data6[0])); 
    worksheet7.addRow(Object.keys(this.sheet_data7[0])); 
    worksheet8.addRow(Object.keys(this.sheet_data8[0]));

    // worksheet4.addRow(Object.keys(this.sheet_data4[0]));
    // worksheet5.addRow(Object.keys(this.sheet_data5[0]));
    // worksheet6.addRow(Object.keys(this.sheet_data6[0]));
    // worksheet7.addRow(Object.keys(this.sheet_data7[0]));
    let Heading = [['ID', 'Name', 'Status', 'actions']];

    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading);
  
    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, this.components, { origin: 'A2', skipHeader: true });
  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    //XLSX.writeFile(wb, 'filename.xlsx');
    // Adding Data with Conditional Formatting
    this.sheet_data_1.forEach((d: any) => {
      worksheet.addRow(Object.values(d));
    });

    worksheet.getRow(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '58f359' },
    };

    this.sheet_data_2.forEach((d: any) => {
      worksheet_2.addRow(Object.values(d));
    });



    this.sheet_data4.forEach((d: any) => {
      worksheet4.addRow(Object.values(d));
    });

    worksheet4.getRow(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '58f359' },
    };
   
    
    this.components.forEach((d: any) => {
      worksheet3.addRow(Object.values(d));
    });

    worksheet3.getRow(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '58f359' },
    };
    this.sheet_data_2.forEach((d: any) => {
      worksheet_2.addRow(Object.values(d));
    });

    worksheet_2.getRow(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2bdfdf' },
    };
    this.sheet_data6.forEach((d: any) => {
      worksheet6.addRow(Object.values(d));
    });

    worksheet6.getRow(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFA533' },
    };
    this.sheet_data7.forEach((d: any) => {
      worksheet7.addRow(Object.values(d));
    });

    worksheet.getRow(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFA533' },
    };
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'my_multi_sheet_doc.xlsx','Sheet1');
    });
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
   * @param modal
   * @param id
   */
  modalOpen(modal,id): void {
    this.selectedId = id;

    let node = modal._declarationTContainer? modal._declarationTContainer.localNames[0] : modal;
    switch (node) {
      case 'Deletemodal':
        this.modalService.open(modal,
          {
            centered: true,
            windowClass: 'modal modal-danger'
          });
        break;

      case 'Detailmodal':
        this.SelectItem(id);
        this.modalService.open(ComponentDetailComponent,
          {
            centered: false,
            windowClass: 'modal modal-primary',
            size: 'lg'
          });
        break;
    }



  }


  /**
   * Open Edit Oem
   *
   * @param id
   */
  async SelectItem(id) {
    await this._componentService.GetByIdAsync(id);
  }

  /**
   * delete item
   * @param id
   */
  async delete(id) {
    await this._componentService.DeleteAsync(id);
  }

  /**
   * Filter By OEM
   *
   * @param event
   */
  filterByOem(event) {
    this.previousOemIdFilter = event ? event.id : '';
    this.tempFilterData = this.filterRows(this.previousOemIdFilter , this.previousCategoryIdFilter);
    this.components = this.tempFilterData;
  }


  /**
   * Filter By Type
   *
   * @param event
   */
  filterByCategory(event) {
    this.previousCategoryIdFilter = event ? event.id : '';
    this.tempFilterData = this.filterRows(this.previousOemIdFilter,  this.previousCategoryIdFilter);
    this.components = this.tempFilterData;
  }
  
  /**
   * Filter Rows
   *
   * @param oemFilter
   * @param categoryFilter
   */
  filterRows(oemFilter,categoryFilter): any[] {
    return this.tempData.filter(row => {
      const isPartialOEMMatch = row.fK_OemId == oemFilter || !oemFilter;
      const isPartialTypeMatch = row.fK_CategoryId == categoryFilter || !categoryFilter;
      return isPartialOEMMatch && isPartialTypeMatch;
    });
  }

}
