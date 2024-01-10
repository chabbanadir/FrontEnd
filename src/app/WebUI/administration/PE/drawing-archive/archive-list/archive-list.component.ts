import { Component, OnInit } from '@angular/core';
import { DataSavingModel } from 'app/Domain/Entities/DrawingGenerator/DataSaving.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';

// Include styles in your component
import '@swimlane/ngx-datatable/themes/material.scss'; // Choose a theme
import { ArchiveService } from '../services/archive.service';
import { OemService } from '../../data/oem/services/oem.service';
import { FilterByOEMPipe } from './filter-by-oem.pipe';

@Component({
  selector: 'app-archive-list',
  templateUrl: './archive-list.component.html',
  styleUrls: ['./archive-list.component.scss']
})
export class ArchiveListComponent implements OnInit{

  filterOEM: string = ''; // Set the initial value to an empty string
  selectedOEMName: string = ''; // This property will hold the selected OEM name
  uniqueOEMs: { id: string, name: string }[] = []; 
  searchTerm: string = '';
  oemNames: { [id: string]: string } = {};
  hideObsolete: boolean = false; // Default to show all items
  editObsolete: boolean = false;
  originalIsObsoleteValues: boolean[] = [];


  currentPage: number = 1;
  itemsPerPage: number = 12;



  id_dialog:any;
  display_dialog:boolean = false;
  drawingDisplay: any[] = []
  drawing : DataSavingModel[] =[]

  filterData: any;
  Oem: any;
  oem: string;
  constructor(private archiveService : ArchiveService,private oemService: OemService) {}
  

  ngOnInit(): void{
  
    this.archiveService.getAllDrawings().subscribe((data: any[]) => {
      this.drawingDisplay = data.reverse();
    });
    this.oemService.GetAllAsync().then(response => {
      this.filterData = response; // Assuming that the API response is an array of drawing data
      this.updateDrawingOEM();
    }).catch(error => {
      console.log(error);
    });

    

  }

  updateDrawingOEM() {
    // Assuming your API response provides ID and name for OEMs
    this.uniqueOEMs = Array.from(new Set(this.filterData.map(item => ({ id: item.id, name: item.name }))));
  }

  handlesendId(id: any){
    this.id_dialog = id
  }
  handlesendDisplayBool(bool:boolean){
    this.display_dialog=bool
  }
  

    // Filter function to be used in ngFor
    filterItems() {

      const searchTermLower = this.searchTerm.toLowerCase(); // Convert the searchTerm to lowercase once
      let filteredItems = this.drawingDisplay.filter(item => {
        if (this.hideObsolete) {
          return (
            (item.te_pn.toLowerCase().includes(searchTermLower) ||
             item.cpn.toLowerCase().includes(searchTermLower) ||
             item.project_number.toLowerCase().includes(searchTermLower)) &&
            item.isObsolete !== true
          );
        } else {
          return (
            (item.te_pn.toLowerCase().includes(searchTermLower) ||
             item.cpn.toLowerCase().includes(searchTermLower) ||
             item.project_number.toLowerCase().includes(searchTermLower)
          ));
        }
      });
    
      // Apply the filterByOEM pipe here
      const filterByOEMPipe = new FilterByOEMPipe(); // Create an instance of the filterByOEM pipe
      filteredItems = filterByOEMPipe.transform(filteredItems, this.filterOEM); // Apply the filter
    
      return filteredItems;
    }

    toggleEditObsolete() {
      if (this.editObsolete) {
        // If "Edit Obsolete" checkbox is checked, backup and set isObsolete to false for all items
        this.originalIsObsoleteValues = this.drawingDisplay.map(item => item.isObsolete);
        this.drawingDisplay.forEach(item => (item.isObsolete = false));
      } else {
        // If "Edit Obsolete" checkbox is unchecked, restore the original isObsolete values
        this.drawingDisplay.forEach((item, index) => (item.isObsolete = this.originalIsObsoleteValues[index]));
      }
    }
  

    nextPage() {
      if ((this.currentPage * this.itemsPerPage) < this.filterItems().length) {
        this.currentPage++;
      }
    }
    
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }

    filterChange() {
      this.currentPage = 1;
    }

    
}
