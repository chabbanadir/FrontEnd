import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OemService } from '../../../data/oem/services/oem.service';
import { HarnessMakerService } from '../../../data/harness-maker/services/harness-maker.service';

@Component({
  selector: 'app-drawing-card',
  templateUrl: './drawing-card.component.html',
  styleUrls: ['./drawing-card.component.scss']
})
export class DrawingCardComponent implements OnInit {


   
  Oem : any;
  HarnessMaker: any;
  @Input() drawing: any;
  constructor(private router: Router,private oemService: OemService, private harnessmakerService: HarnessMakerService) { }

  ngOnInit(): void {
    this.oemService.GetByIdAsync(this.drawing.oem).then(response => {
      this.Oem = response;
      this.updateDrawingOem(); // Call the logOem() function to update drawing.oem
    }).catch(error => {
      console.log(error);
    });
    this.harnessmakerService.GetByIdAsync(this.drawing.harnessMaker).then(response => {
      this.HarnessMaker = response;
      this.updateDrawingHarnessMaker(); // Call the logOem() function to update drawing.oem
    }).catch(error => {
      console.log(error);
    });
  }

  navigateToDetails(drawingId: string) {
    
    this.router.navigate(['PE/drawingsData/', drawingId]);
  }
  async updateDrawingOem() {
    const data = await this.Oem;
    this.drawing.oem = data.name; // Update the value of drawing.oem
  }
  async updateDrawingHarnessMaker() {
    const data = await this.HarnessMaker;
    this.drawing.harnessMaker = data.name; // Update the value of drawing.HarnessMaker
   
  }
}
