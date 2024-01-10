import { BomModel } from './../../../../../../../Domain/Entities/DrawingGenerator/Bom.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as pdfjsLib from "pdfjs-dist";
import {HomeComponent} from "../home.component";
import {TEPDF} from "./ext/TEPDF";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import {CategoryModel} from "../../../../../../../Domain/Entities/MasterData/Category.model";
import {CableModel} from "../../../../../../../Domain/Entities/MasterData/Cable.model";

import { Workbook } from 'exceljs';
import {ProjectModel} from "../../../../../../../Domain/Entities/DrawingGenerator/Project.model";
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
import { DrawingService } from '../../services/drawing.service';
import { DataSavingModel } from 'app/Domain/Entities/DrawingGenerator/DataSaving.model';
import { Router } from '@angular/router';
import { ArchiveService } from 'app/WebUI/administration/PE/drawing-archive/services/archive.service';
@Component({
  selector: 'app-step6',
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.scss']
})
export class Step6Component implements OnInit, OnDestroy {
  Category: CategoryModel[];
  cable : CableModel[];
  public static pdf: TEPDF;  
  fileName= 'ExcelSheet.xlsx';
  static updateBool: boolean = false;
  static idDrawing: any;
  constructor(private drawingService : DrawingService, private archiveService : ArchiveService, private router:Router) {

  }

  Bom: BomModel[];
  //public categories: CategoryModel[];
 

  static config: ProjectModel = new ProjectModel();

  ngOnDestroy(): void {
    Step6Component.idDrawing = null
  }
  ngOnInit(): void {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';
    Step6Component.pdf = new TEPDF('pd-container', '/assets/drawings/prod/A2 PD.pdf', {
      onPageUpdated(page, oldData, newData) {
        //        console.log(page, oldData, newData);
      },
      ready() {
        //Step6Component.config.packaging,"bom";
        Step6Component.pdf.addImageToCanvas(HomeComponent.config.pd_bom,"bom");
        Step6Component.pdf.addImageToCanvas(HomeComponent.config.pd_picture,"picture");
        Step6Component.pdf.addImageToCanvas(HomeComponent.config.pd_lengths,"lengths");
        Step6Component.pdf.addImageToCanvas(HomeComponent.config.pinning,"pinning");
        Step6Component.pdf.addImageToCanvas(HomeComponent.config.pd_notes,"notes");
        Step6Component.pdf.addImageToCanvas(HomeComponent.config.packaging,"packaging");
      },
      scale: 1.5,
      pageImageCompression: 'SLOW', // FAST, MEDIUM, SLOW(Helps to control the new PDF file size)
    });
  }

  savaPdf() {
    Step6Component.pdf.savePdf(HomeComponent.config.projectNumber);
    console.log("Data inside HomeCOmponent" +JSON.stringify(HomeComponent.config));
    console.log("DataSaving" +JSON.stringify(HomeComponent.dataSaving));

  }

  title = 'angular-export-to-excel';

  sheet_data_1 = [
  
    // HomeComponent.config.pd_bom,"bom",
    HomeComponent.config.partNumber,
    HomeComponent.config.customerPN,
    HomeComponent.config.PDMLINK,
    HomeComponent.config.cd_bom,
  

];
  sheet_data_2 = [
    {
      "QTY REQD REP ASSY" :HomeComponent.config.partNumber,
      "U/M ": HomeComponent.config.BOM.length,
     //"PART NO ":  HomeComponent.config.components.length,
      "REMARKS ": HomeComponent.config.customerPN,
      "DESCRIPTION" : HomeComponent.config.BOM.length,
      "ITEM ": 2022,
      "Levels ": 132412,
      "Packing Note : ": 12,
      "Coil Diameter (mm) : ": 35,
      "Customer Drawing : ": 111,
    },
   
  ];

  sheet_data3 = [
    {
      "QTY REQD REP ASSY" :HomeComponent.config.partNumber,
      "U/M ": HomeComponent.config.BOM.length,
      "PART NO ":  HomeComponent.config.BOM.length,
      "REMARKS ": HomeComponent.config.customerPN,
      "DESCRIPTION" : HomeComponent.config.BOM.length,
      "ITEM ": 1,
      "Level ": " ",
      "Position ": "Connector_1",
      //"Coil Diameter (mm) : ": 35,
      //"Customer Drawing : ": 111,
    },
    {
      "QTY REQD REP ASSY" :HomeComponent.config.partNumber,
      "U/M ": HomeComponent.config.BOM.length,
      "PART NO ":  HomeComponent.config.BOM.length,
      "REMARKS ": HomeComponent.config.customerPN,
      "DESCRIPTION" : HomeComponent.config.BOM.length,
      "ITEM ": 2,
      "Level ": " ",
      "Position ": "Connector_2",
      //"Coil Diameter (mm) : ": 35,
      //"Customer Drawing : ": 111,
    },
    {
      "QTY REQD REP ASSY" :HomeComponent.config.partNumber,
      "U/M ": HomeComponent.config.BOM.length,
      "PART NO ":  HomeComponent.config.BOM.length,
      "REMARKS ": HomeComponent.config.customerPN,
      "DESCRIPTION" : HomeComponent.config.BOM.length,
      "ITEM ": 3,
      "Level ": " ",
      "Position ": "Connector_3",
      //"Coil Diameter (mm) : ": 35,
      //"Customer Drawing : ": 111,
    },
    {
      "QTY REQD REP ASSY" :HomeComponent.config.partNumber,
      "U/M ": HomeComponent.config.BOM.length,
      "PART NO ":  HomeComponent.config.BOM.length,
      "REMARKS ": HomeComponent.config.customerPN,
      "DESCRIPTION" : HomeComponent.config.BOM.length,
      "ITEM ": 4,
      "Level ": " ",
      "Position ": "Connector_4",
      //"Coil Diameter (mm) : ": 35,
      //"Customer Drawing : ": 111,
    },
   
  ];

  sheet_data4 = [
      {
      "QTY REQD REP ASSY" :HomeComponent.config.partNumber,
      "U/M ": HomeComponent.config.pd_bom.fromJSON,
      "PART NO ":  HomeComponent.config.BOM.length,
      "REMARKS ": HomeComponent.config.customerPN,
      "DESCRIPTION" : HomeComponent.config.BOM.length,
      //"ITEM ": HomeComponent.config.components.length,
      "Level ": " ",
    
    },
    // {
    //   "QTY REQD REP ASSY" :HomeComponent.config.partNumber,
    //   "U/M ": HomeComponent,
    //   "PART NO ":  HomeComponent.config.BOM.length,
    //   "REMARKS ": HomeComponent.config.customerPN,
    //   "DESCRIPTION" : HomeComponent.config.BOM.length,
    //   "ITEM ": 1,
    //   "Level ": " ",
    
    // },    {
    //   "QTY REQD REP ASSY" :HomeComponent.config.partNumber,
    //   "U/M ": HomeComponent,
    //   "PART NO ":  HomeComponent.config.BOM.length,
    //   "REMARKS ": HomeComponent.config.customerPN,
    //   "DESCRIPTION" : HomeComponent.config.BOM.length,
    //   "ITEM ": 1,
    //   "Level ": " ",
    
    // },
     
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
      worksheet.addRow(this.sheet_data_1);
      worksheet_2.addRow(Object.keys(this.sheet_data_2[0]));
      worksheet3.addRow(Object.keys(this.sheet_data3[0]));
      //worksheet3.addRow(Object.keys(this.components[0]));  
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
     // XLSX.utils.sheet_add_json(ws, this.components, { origin: 'A2', skipHeader: true });
    
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
      //XLSX.writeFile(wb, 'filename.xlsx');
      // Adding Data with Conditional Formatting
      
      
      // this.sheet_data_1.forEach((d: any) => {
      //   worksheet.addRow(Object.values(d));
      // });
  
      // worksheet.getRow(2).fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: '58f359' },
      // };


  
      this.sheet_data_2.forEach((d: any) => {
        worksheet_2.addRow(Object.values(d));
      });
      this.sheet_data3.forEach((d: any) => {
        worksheet3.addRow(Object.values(d));
      });
      this.sheet_data4.forEach((d: any) => {
        worksheet4.addRow(Object.values(d));
      });
  
      // worksheet4.getRow(2).fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: '58f359' },
      // };
     
      
      // this.components.forEach((d: any) => {
      //   worksheet3.addRow(Object.values(d));
      // });
  
      // worksheet3.getRow(2).fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: '58f359' },
      // };
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
  
      //Generate & Save Excel File
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        fs.saveAs(blob, 'Smart Assembly.xlsx','Sheet1');
      });
    }
  
      // let arr = [
      //   { firstName: 'Jack', lastName: 'Sparrow', email: 'abc@example.com' },
      //   { firstName: 'Harry', lastName: 'Potter', email: 'abc@example.com' },
      // ];
    
      // let Heading = [['ID', 'Name', 'CustomerPN', 'TE PN', 'Status']];
    
      // //Had to create a new workbook and then add the header
      // const wb = XLSX.utils.book_new();
      // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
      // XLSX.utils.sheet_add_aoa(ws, Heading);
    
      // //Starting in the second row to avoid overriding and skipping headers
      // XLSX.utils.sheet_add_json(ws, this);
    
      // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
      // XLSX.writeFile(wb, 'filename.xlsx');
    





  // exportToExcel() {
    
    
    
  //   Step6Component.pdf.savePdf(HomeComponent.config.projectNumber);
  // }

  modernHorizontalPrevious() {
    HomeComponent.modernHorizontalPrevious("step5");
  }

  modernHorizontalNext() {
    const dataToBeSent: DataSavingModel = HomeComponent.dataSaving
    setTimeout(() => {

    if(Step6Component.updateBool === false){
    this.archiveService.createDrawingData(dataToBeSent).subscribe(
      (response) => {
        console.log('Data sent successfully:', response);
        // Handle the response from the backend as needed
        this.router.navigate(['/PE/drawingArchive']);

      },
      (error) => {
        console.error('Error sending data:', error);
        // Handle errors
      }
    );
  }else{
    HomeComponent.dataSaving.id = Step6Component.idDrawing;
    this.archiveService.updateDrawingData(dataToBeSent,Step6Component.idDrawing).subscribe(
      (response) => {
        console.log('Data sent successfully:', response);
        // Handle the response from the backend as needed
        this.router.navigate(['/PE/drawingArchive']);

      },
      (error) => {
        console.error('Error sending data:', error);
        // Handle errors
      }
    );
  }

}, 2000);
    HomeComponent.modernHorizontalNext();
  }
}
