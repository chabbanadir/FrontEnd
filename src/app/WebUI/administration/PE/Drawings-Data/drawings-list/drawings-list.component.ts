import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DrawingService } from '../Services/Drawing-data.service';

@Component({
  selector: 'app-drawings-list',
  templateUrl: './drawings-list.component.html',
  styleUrls: ['./drawings-list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class DrawingsListComponent implements OnInit {
    drawings: any[] = [];

    constructor(private drawingService: DrawingService) { }

    ngOnInit(): void {
      this.fetchDrawings();
     
    }
    fetchDrawings() {
      this.drawingService.getAllAsync()
        .then((drawings: any[]) => {
          this.drawings = drawings;
      
        })
        .catch(error => {
          console.error('Failed to fetch drawings:', error);
        });
  }
}
