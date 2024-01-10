import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HomeComponent} from "../home.component";
import * as pdfjsLib from 'pdfjs-dist';
import {TEPDF} from "./ext/TEPDF";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import * as XLSX from 'xlsx';
import {CableModel} from "../../../../../../../Domain/Entities/MasterData/Cable.model"; 

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Step5Component implements OnInit {
  public static pdf: TEPDF;

  public cables: CableModel[];
  constructor() {

  }

  ngOnInit(): void {


    
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

    Step5Component.pdf = new TEPDF('cd-container', '/assets/drawings/customer/A3 CD.pdf', {
      ready() {

        Step5Component.pdf.addImageToCanvas(HomeComponent.config.cd_bom,"bom");
        Step5Component.pdf.addImageToCanvas(HomeComponent.config.cd_picture,"picture");
        Step5Component.pdf.addImageToCanvas(HomeComponent.config.cd_lengths,"lengths");
        Step5Component.pdf.addImageToCanvas(HomeComponent.config.pinning,"pinning");
        Step5Component.pdf.addImageToCanvas(HomeComponent.config.cd_notes,"notes");
      },
      scale: 1.5,
      pageImageCompression: 'SLOW', // FAST, MEDIUM, SLOW(Helps to control the new PDF file size)
    });
  }
   
  base64ToBlob(base64: string, format: string = 'image/png'): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
 
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
 
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
 
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert base64 to blob'));
          }
        }, format);
      };
 
      img.onerror = (error) => {
        reject(error);
      };
 
      img.src = base64;
    });
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
    //XLSX.utils.sheet_add_json(ws, HomeComponent.config.cd_bom);
  
    XLSX.utils.book_append_sheet(wb, ws, 'assets/sheet/TEST1100 (4).xlsm');
  
    XLSX.writeFile(wb, 'assets/sheet/TEST1100 (4).xlsm');
  }


  savaPdf() {
    Step5Component.pdf.savePdf(HomeComponent.config.projectNumber);
  }

  modernHorizontalPrevious() {
    HomeComponent.modernHorizontalPrevious("step4");
  }

  async modernHorizontalNext() {
    try {
      const blob = await this.base64ToBlob(HomeComponent.config.cd_picture, 'image/png');
      HomeComponent.dataSaving.image_drawing = new File([blob], 'image.png', { type: 'image/png' });
    } catch (error) {
      console.error('Failed to convert image:', error);
    }
    HomeComponent.modernHorizontalNext();
  }

  
}
