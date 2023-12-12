import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import Stepper from "bs-stepper";
import {ProjectModel} from "../../../../../../Domain/Entities/DrawingGenerator/Project.model";
import {ComponentModel} from "../../../../../../Domain/Entities/MasterData/Component.model";
import { DataSavingModel } from 'app/Domain/Entities/DrawingGenerator/DataSaving.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'chat-application' }
})
export class HomeComponent implements OnInit {

  // step 1

  static modernWizardStepper: Stepper;
  static dataSaving: DataSavingModel = new DataSavingModel();
  static config: ProjectModel = new ProjectModel();
  
  static compo: ComponentModel = new ComponentModel();
  static diagramNodeData = [];

  ngOnInit(): void {

    HomeComponent.modernWizardStepper = new Stepper(document.querySelector('#stepper'), {
      linear: false,
      animation: true
    });

  }

  static modernHorizontalPrevious(step) {

    switch (step) {
      case "step4":
        this.config.cd_picture = null;
        this.config.cd_bom = null;
        this.config.cd_notes = null;
        this.config.cd_lengths = null;
        this.config.pd_picture = null;
        this.config.pd_notes = null;
        this.config.pd_bom = null;
        this.config.pd_lengths = null;
        this.config.packaging = null;
        this.config.pinning = null;
        this.config.cableId = null;        
        this.config.categoryId = null;
        this.config.oemId = null;
        this.config.oemname = null;
        
        this.config.PDMLINK = null;
        break;
      case "step3":
        this.config.left = null;
        this.config.right = null;
        this.config.cd_bom = null;
        break;
      case "step2":
        this.config.countSides = null;
        this.config.projectNumber = null;
        this.config.customerPN = null;
        this.config.oemId = null;
        this.config.oemname = null;
        this.config.harnessMakerId = null;
        break;
      case "step1":
        this.config.partNumber = null;
        break;
    }
    this.modernWizardStepper.previous();
  }

  modernHorizontalPrevious() {
    //   NewDrawingComponent.modernHorizontalPrevious("ste");
  }

  modernHorizontalNext() {
    HomeComponent.modernHorizontalNext();
  }

  static modernHorizontalNext() {
    this.modernWizardStepper.next();
   // console.log(HomeComponent.config);
  }


  static updateConfig(config) {
    this.config = config;
    this.modernWizardStepper.next();
  }

  getConfig(){
    return HomeComponent.config;
  }

  cd_allTablesLoaded() {
    return HomeComponent.config.cd_bom != null
        && HomeComponent.config.cd_lengths!=null
        && HomeComponent.config.pinning!=null
        && HomeComponent.config.cd_picture!=null
        && HomeComponent.config.cd_notes!=null;
  }


  pd_allTablesLoaded() {
    return HomeComponent.config.pd_bom != null
        && HomeComponent.config.pd_picture!=null
        && HomeComponent.config.pinning!=null
        && HomeComponent.config.pd_notes!=null
        && HomeComponent.config.packaging!=null;
  }

  sides_Loaded() {
    return HomeComponent.config.left != null
        && HomeComponent.config.right != null;
  }
}
