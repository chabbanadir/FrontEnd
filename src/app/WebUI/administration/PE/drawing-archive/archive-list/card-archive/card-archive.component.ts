import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataSavingModel } from 'app/Domain/Entities/DrawingGenerator/DataSaving.model';
import { OemService } from '../../../data/oem/services/oem.service';
import { EditService } from '../../../edit.service';
import { Router } from '@angular/router';
import { Step6Component } from '../../../drawing-generator/new-pn/home/step6/step6.component';
import { ArchiveService } from '../../services/archive.service';
import { AuthenticationService } from 'app/Identity/service';

@Component({
  selector: 'app-card-archive',
  templateUrl: './card-archive.component.html',
  styleUrls: ['./card-archive.component.scss']
})
export class CardArchiveComponent implements OnInit {

  @Input() drawing : any ;
  display:boolean = true;
  @Output() sendId = new EventEmitter<any>();
  @Output() sendDisplayBool = new EventEmitter<any>();
  Oem: any;
  oem: string;
  details:any;
  currentUser: any;
  dateTime: Date = new Date();
  constructor(private oemService: OemService,private editService:EditService, private router: Router, private archiveService : ArchiveService, private _authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
    console.log(JSON.stringify(this.drawing))
    this.oemService.GetByIdAsync(this.drawing.id_oem).then(response => {
      this.Oem = response;
      this.updateDrawingOem();
    }).catch(error => {
      console.log(error);
    });

    this.archiveService.getById(this.drawing.id)
    .subscribe((response: any) => {
      this.details = response;
    });
  }

  async updateDrawingOem() {
    const data = await this.Oem;
    this.oem = data.name; 
  }
  showDialog(): void {
    this.sendId.emit(this.drawing.id);
    console.log("this.drawing" + JSON.stringify(this.drawing))
  }

  sendDisplay(){
    this.sendDisplayBool.emit(this.display);

  }

  editDrawing(){
    this.editService.setSharedData(this.details);
    Step6Component.idDrawing = this.drawing.id
    this.router.navigate(['/PE/drawingGenerator/newPN']);
  }
  
  setUpdateBool(){
    this.editService.setUpdateBool();
  }

  getTextColorClass(rev) {
    if (rev.match(/^[Aa]/)) {
        return 'green';
    } else if (rev.match(/^[Bb]/)) {
        return 'orange';
    } else {
        return 'red'; // You can provide a default class or no class if needed.
    }
}

  getDetails(){
  }
}
