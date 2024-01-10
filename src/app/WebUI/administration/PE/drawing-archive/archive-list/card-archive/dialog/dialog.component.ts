import { Component, Input, OnInit, OnChanges, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { DataSavingModel } from 'app/Domain/Entities/DrawingGenerator/DataSaving.model';
import { ArchiveService } from '../../../services/archive.service';
import { HarnessMakerService } from 'app/WebUI/administration/PE/data/harness-maker/services/harness-maker.service';
import { OemService } from 'app/WebUI/administration/PE/data/oem/services/oem.service';
import { Router } from '@angular/router';
import { ComponentService } from 'app/WebUI/administration/PE/data/component/services/component.service';
import { CableService } from 'app/WebUI/administration/PE/data/cable/services/cable.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnChanges {

  @Output() sendDisplayBool = new EventEmitter<any>();
  @Input() idDrawing : string
  detailsData: DataSavingModel;
  detailsDataTestList: any;

 
  display: boolean = false;
  Oem: any;
  HarnessMaker: any;
  oem: string;
  harnessMaker: string;
  Connector: any;
  connectorLeft: string[] = [];
  connectorRight: string[] = [];
  Lead: any;
  lead: {lead : string , name : string, length : number}[] = [];
  constructor(private archiveService : ArchiveService,private oemService: OemService, private harnessmakerService: HarnessMakerService, private componentService:ComponentService, private cableService:CableService) { }
  ngOnChanges(): void {
    console.log(this.idDrawing);
  }

  ngOnInit(): void {
    this.archiveService.getById(this.idDrawing)
      .subscribe((response: any) => {
        this.detailsDataTestList = response;
        console.log("hooo" + JSON.stringify(this.detailsDataTestList));
  
        // Place the rest of your code inside this subscription block
        this.processConnectorDrawings();
        this.processLeads();
        this.retrieveOemAndHarnessMaker();
      });

  }
  
  processConnectorDrawings() {

    this.detailsDataTestList.connectorDrawings.forEach(item => {
      console.log("item" + JSON.stringify(item));

      if (item.side === "LEFT") {
        console.log("itemLLLLLLL" + JSON.stringify(item));
        this.componentService.GetByIdAsync(item.id_connector).then(response => {
          this.Connector = response;
          const data = this.Connector;
          this.connectorLeft.push(data.name);
          console.log("left" + JSON.stringify(this.connectorLeft));
        }).catch(error => {
          console.log(error);
        });
      } else {
        this.componentService.GetByIdAsync(item.id_connector).then(response => {
          console.log("itemRRRRR" + JSON.stringify(item));
          this.Connector = response;
          const data = this.Connector;
          this.connectorRight.push(data.name);
          console.log("right" + JSON.stringify(this.connectorRight));
        }).catch(error => {
          console.log(error);
        });
      }
    });

  }
  
  processLeads() {
    this.detailsDataTestList.leads.forEach(item => {
      this.cableService.GetByIdAsync(item.id_cable).then(response => {
        this.Lead = response;
        const data = this.Lead;
        this.lead.push({ lead: item.lead, length: item.length, name: data.name });
      }).catch(error => {
        console.log(error);
      });
    });
  }
  
  retrieveOemAndHarnessMaker() {
    this.oemService.GetByIdAsync(this.detailsDataTestList.id_oem).then(response => {
      this.Oem = response;
      this.updateDrawingOem();
    }).catch(error => {
      console.log(error);
    });
  
    this.harnessmakerService.GetByIdAsync(this.detailsDataTestList.id_harnessmaker).then(response => {
      this.HarnessMaker = response;
      this.updateDrawingHarnessMaker();
    }).catch(error => {
      console.log(error);
    });
  }

  async updateDrawingOem() {
    const data = await this.Oem;
    this.oem = data.name; 
  }
  async updateDrawingHarnessMaker() {
    const data = await this.HarnessMaker;
    this.harnessMaker = data.name; 
   
  }

  
  downloadFile(url: string): void {
    fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = this.getFileNameFromPath(url); // Extract filename from the URL
      anchor.click();
      window.URL.revokeObjectURL(blobUrl); // Clean up the blob URL after use
    })
    .catch(error => {
      console.error('Error downloading file:', error);
    });
  }
  
  downloadCDrawing() {
    this.downloadFile(this.detailsDataTestList.c_pdf);
  }
  downloadPDrawing(): void {
    this.downloadFile(this.detailsDataTestList.p_pdf);
  }
  
  downloadSmartAssembly(): void {
    this.downloadFile(this.detailsDataTestList.smart_assembly);
  }
  
    
    getFileNameFromPath(filePath: string): string {
      // Use the split method to extract the file name from the path
      const parts = filePath.split('/');
      return parts[parts.length - 1];
    }
    
  closeDialog(): void {
    this.sendDisplayBool.emit(this.display);
  }

  getTextColorClass(rev) {
    
    if (rev.match(/^[Aa]/)) {
        return 'green';
    } else if (rev.match(/^[Bb]/)) {
        return 'orange';
    } else {
        return 'red';
    }
}
}
