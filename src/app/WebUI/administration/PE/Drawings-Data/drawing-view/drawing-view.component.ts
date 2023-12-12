import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrawingService } from '../Services/Drawing-data.service';
import { Drawing } from 'app/Domain/Entities/Drawing-data/Drawing.model';
import { OemService } from '../../data/oem/services/oem.service';
import { HarnessMakerService } from '../../data/harness-maker/services/harness-maker.service';
import { ComponentService } from '../../data/component/services/component.service';

@Component({
  selector: 'app-drawing-view',
  templateUrl: './drawing-view.component.html',
  styleUrls: ['./drawing-view.component.scss']
})
export class DrawingViewComponent implements OnInit {

  drawing: Drawing;
  files: { name: string, url: string }[];

  constructor(
    private route: ActivatedRoute,
     private drawingService: DrawingService,
     private router: Router,
     private oemService: OemService,
     private harnessMakerService: HarnessMakerService,
     private componentService: ComponentService,) { }

  ngOnInit(): void {
    const drawingId = this.route.snapshot.params.id;
  
    this.drawingService.getDrawingById(drawingId)
      .then((drawing: Drawing) => {
        this.drawing = drawing;
        console.log(drawing);
        console.log(drawing.componentsData);
        const promises = drawing.componentsData.map(element => {
          return this.componentService.GetByIdAsync(element.componentId)
            .then(component => {
              element.componentId = component.name;

            });
        });
        // Retrieve OEM name
        promises.push(this.oemService.GetByIdAsync(drawing.oem)
        .then(oem => {
          drawing.oem = oem.name;
        }));

        // Retrieve Harness Maker name
        promises.push(this.harnessMakerService.GetByIdAsync(drawing.harnessMaker)
          .then(harnessMaker => {
            drawing.harnessMaker = harnessMaker.name;
          }));

        // Wait for all promises to resolve
        return Promise.all(promises);
      })
      .then(() => {
        // Handle the retrieved drawing object with transformed components
      })
      .catch(error => {
        if (error && error.error) {
          // Handle the specific error returned from the API
          console.log(error.error);
        } else {
          // Handle generic error
          console.log(error);
        }
      });
  }

  goBack(): void {
    // Naviguer vers la page précédente
    this.router.navigate(['/PE/drawingsData/']);
  }

  downloadFile(url: string): void {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = url.substring(url.lastIndexOf('/') + 1);

    // Simulate a click event to trigger the download
    link.dispatchEvent(new MouseEvent('click'));

    // Clean up the temporary anchor element
    link.remove();
  }
  getComponentsBySide(side: string): { componentId: string; side: string }[] {
    return this.drawing.componentsData.filter(component => component.side === side);
  }
  
}
