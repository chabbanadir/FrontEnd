import { Component, OnDestroy, OnInit } from '@angular/core';
import {ComponentModel} from "../../../../../../../Domain/Entities/MasterData/Component.model";
import {Subject} from "rxjs";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {DragulaService} from "ng2-dragula";
import {HomeComponent} from "../home.component";
import {PictureModel} from "../../../../../../../Domain/Entities/MasterData/Picture.model";
import {environment} from "../../../../../../../../environments/environment";
import {DrawingService} from "../../services/drawing.service";
import {ComponentService} from "../../../../data/component/services/component.service";
import {CableModel} from "../../../../../../../Domain/Entities/MasterData/Cable.model";
import * as XLSX from 'xlsx';
import { DrawingConnectorModel } from 'app/Domain/Entities/DrawingGenerator/DrawingConnector.model';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit,OnDestroy {

  fileName= 'ExcelSheet.xlsx';
  left : ComponentModel[];
  right : ComponentModel[];
  connectors:DrawingConnectorModel[] = [];
  leftConnector = new DrawingConnectorModel();
  rightConnector = new DrawingConnectorModel();
  valid: boolean;
  components: ComponentModel[];
  cables: CableModel[];


  private _unsubscribeAll: Subject<any>;


  constructor(
      private dragulaService: DragulaService,
      private _drawingService: DrawingService,
      private _componentService: ComponentService
  ) {
    this._unsubscribeAll = new Subject();
  }


  drop(event: CdkDragDrop<any[]>)
  {
    if (event.previousContainer === event.container)
    {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else
    {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
  }




  async ngOnInit() {
    console.log("step 3");

    await this._drawingService.GetComponentsByIdAsync(HomeComponent.config.oemId).then((res: any) => { // Success
      this.components = res;
    });

    await this._drawingService.GetCablesByIdAsync(HomeComponent.config.oemId).then((res: any) => { // Success
      this.cables = res;
    });

    this.dragulaService.createGroup('CONNECTOR', {});

    this.left = [];
    this.right = [];

    for (let i = 0; i < HomeComponent.config.countSides; i++)
    {
      this.left.push({id: i, ...new ComponentModel});
    }

    this.valid = false;
  }
  exportexcel(){

    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
    
      }
  ngOnDestroy(): void {
    this.dragulaService.destroy('CONNECTOR');
  }

  modernHorizontalPrevious() {
    this.valid = false;
    HomeComponent.modernHorizontalPrevious("step2");
  }

  modernHorizontalNext() {
    console.log("left" + JSON.stringify(this.left))
    HomeComponent.config.left = this.left;
    HomeComponent.config.right = this.right;
    HomeComponent.config.cables = this.cables;
    for (const item of this.left){

      this.leftConnector.id_connector = item.id
      //this.leftConnector.config = new SavingConfigurationModel(item.config.id,item.config.note.id)
      this.leftConnector.id_config = item.config.id
      this.leftConnector.id_note = item.config.note.id
      this.leftConnector.PDMLink_connector = item.pdM_LINK_PN
      this.leftConnector.side = "LEFT"
      this.leftConnector.position = item.position
      this.connectors.push(this.leftConnector)
    }
    for (const item of this.right){

      this.rightConnector.id_connector = item.id
      //this.rightConnector.config = new SavingConfigurationModel(item.config.id,item.config.note.id)
      this.rightConnector.id_config = item.config.id
      this.rightConnector.id_note = item.config.note.id
      this.rightConnector.PDMLink_connector = item.pdM_LINK_PN
      this.rightConnector.side = "RIGHT"
      this.rightConnector.position = item.position
      this.connectors.push(this.rightConnector)
    }
    HomeComponent.dataSaving.connectors = this.connectors
    HomeComponent.modernHorizontalNext();
  }

  async updateCount() {
    let cl = this.left.filter(item => item.name != null).length;
    let rl = this.right.filter(item => item.name != null).length;

    this.valid = (cl + rl) == HomeComponent.config.countSides;
  }

  async updateLeft(i) {
    await this._drawingService.GetParts(this.left[i].id).then((res: any) => { // Success
      this.left[i] = res;
    });
  }

  async updateRight(i) {
    await this._drawingService.GetParts(this.right[i].id).then((res: any) => { // Success
      this.right[i] = res;
    });
  }


/*  getCDN(pic: PictureModel)
  {
    if(pic) return environment.cdnUrl +pic.picPath
        else return "assets/images/connectors/default-image.jpg";
  }*/

  getCDN(component: ComponentModel) {

    try {
      if (component.picture)
        return environment.cdnUrl + component.picture.picPath;
      else
        return environment.cdnUrl + component.config.picture.picPath;
    }
    catch (e) {
      return 'assets/images/connectors/default-image.jpg';
    }

  }

  getPosition(side: ComponentModel){
    if(side){
      if(side.config) return side.config.position+ ' W';
      if(side.position) return side.position + ' W';
    } else return '';
  }


  /**
   * SearchForPart
   *
   */
  SearchForComponent(term: string, item: ComponentModel) {
    term = term.toLocaleLowerCase();

    let  searchByTEPN = item.tE_PN ? item.tE_PN.toLowerCase().indexOf(term) !== -1: false;
    let  searchByCPN = item.customer_PN ? item.customer_PN.toLowerCase().indexOf(term) !== -1: false;


    return searchByTEPN || searchByCPN || !term;


    // return searchByTEPN  || searchByCPN  ||  (item.tE_PN + " - " + item.customer_PN).toLocaleLowerCase().indexOf(term) > -1;
  }

}