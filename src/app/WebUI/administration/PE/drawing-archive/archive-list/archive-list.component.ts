import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSavingModel } from 'app/Domain/Entities/DrawingGenerator/DataSaving.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';

// Include styles in your component
import '@swimlane/ngx-datatable/themes/material.scss'; // Choose a theme

@Component({
  selector: 'app-archive-list',
  templateUrl: './archive-list.component.html',
  styleUrls: ['./archive-list.component.scss']
})
export class ArchiveListComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  titile = "hello eeeeeeeeeworld ";

;
  drawing : DataSavingModel[] =[]
  test : number[] =  [1,2,3,4,5,6];
  c_pdf: File;
  image_drawing: File;
  p_pdf: File;
  constructor() {
    this.c_pdf = new File(['Sample c_pdf content'], 'c_pdf.pdf', { type: 'application/pdf' });
    this.image_drawing = new File(['Sample image_drawing content'], 'image_drawing.jpg', { type: 'image/jpeg' });
    this.p_pdf = new File(['Sample p_pdf content'], 'p_pdf.pdf', { type: 'application/pdf' });
    
  
   /* // Initialize the drawing object properties
    this.drawing.project_number = "dhdh";
    this.drawing.connectors = [
      {
        id_connector: "26cee45e-87ae-ec11-b887-005056873c66",
        id_config: "2d567a29-87ae-ec11-b887-005056873c66",
        id_note: "c817f4e3-86ae-ec11-b887-005056873c66",
        PDMLink_connector: "1452728CA-A.ASM",
        side: "LEFT",
        position: 1
      },
      {
        id_connector: "26cee45e-87ae-ec11-b887-005056873c66",
        id_config: "2d567a29-87ae-ec11-b887-005056873c66",
        id_note: "c817f4e3-86ae-ec11-b887-005056873c66",
        PDMLink_connector: "1452728CA-A.ASM",
        side: "RIGHT",
        position: 1
      }
    ];
    this.drawing.pinning = [
      {
        pinA: "A",
        pinB: "B"
      }
    ];
    this.drawing.te_pn = "hhf";
    this.drawing.cpn = "dhdh";
    this.drawing.id_oem = "6feba1ab-85ae-ec11-b887-005056873c66";
    this.drawing.id_harnesmaker = "9d56741c-87ae-ec11-b887-005056873c66";
    this.drawing.bom = [
      {
        Id: "6Q0 035 576",
        Customer_PN: "6Q0 035 576",
        TE_PN: "1452728-1",
        Rev: "E",
        Description: "PLUG HOUSING CODE A BLACK, 1WAY, FAKRA 2",
        Qte: 2,
        Count: 1,
        Type: "CD_And_PD",
        UM: "PC",
        PDMLINK: "1452728CA-A.ASM"
      },
      {
        Id: "N 106 471 02",
        Customer_PN: "N 106 471 02",
        TE_PN: "1719792-5",
        PDMLINK: null,
        Rev: "A",
        Description: "SUBASSY PLUG FAKRA, HF",
        Qte: 2,
        Count: 2,
        Type: "CD_And_PD",
        UM: "PC"
      }
    ];
    this.drawing.leads = [
      {
        c_length: 2261,
        length: 2231,
        lead: "L1",
        from: "LEFT_26cee45e-87ae-ec11-b887-005056873c66_0",
        to: "RIGHT_26cee45e-87ae-ec11-b887-005056873c66_0",
        fromPort: "A",
        toPort: "B",
        id_cable: "c2a868b8-86ae-ec11-b887-005056873c66",
        p_length: 2245
      }
    ];
    // Create sample File objects with dummy data
    this.drawing.c_pdf = new File(['Sample c_pdf content'], 'c_pdf.pdf', { type: 'application/pdf' });
    this.drawing.image_drawing = new File(['Sample image_drawing content'], 'image_drawing.jpg', { type: 'image/jpeg' });
    this.drawing.p_pdf = new File(['Sample p_pdf content'], 'p_pdf.pdf', { type: 'application/pdf' });*/
  }
  

  ngOnInit(): void {
    
    
    console.log(JSON.stringify(this.drawing));

  }

  

}
