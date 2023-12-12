import { Component } from "@angular/core";
import { CableModel } from "../MasterData/Cable.model";
import { ComponentModel } from "../MasterData/Component.model";
import { CablesData } from "./CablesData.model";

export class Drawing {
    tePartNumber: string;
    customerPN: string;
    projectNumber: string;
    oem: string;
    harnessMaker: string;
    numberOfConnectors: number;
    componentsData: {
      componentId: string;
      side: string;
    }[];
    cablesData:  CablesData[]   = [];
    cdPath: File;
    pdPath: File;
    excelFilePath: File;
    imagePath: File;
    Bom :  { 
      Id: any;
      Customer_PN: string; 
      TE_PN: string; 
      Description: string; 
      Qte: any; 
      Rev: string; 
      Type: string; 
      Count: any; 
      UM: string;
    }[]   = [];
    cd_lengths:  CablesData[]   = [];
    pd_lengths: CablesData[]   = [];
    pinning: {
      pinA : string,
      pinB : string,
    }[]   = [];
  }

  
  export function drawingToString(drawing: Drawing): string {
    return JSON.stringify(drawing);
  }
  