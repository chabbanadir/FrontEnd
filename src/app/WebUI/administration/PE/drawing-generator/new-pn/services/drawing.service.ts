import { Injectable } from '@angular/core';
import {AsyncRepository, message} from "../../../../../../Persistence/Repository/AsyncRepository";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import { DataSavingModel } from 'app/Domain/Entities/DrawingGenerator/DataSaving.model';

@Injectable()
export class DrawingService extends AsyncRepository {
  constructor(private httpClient: HttpClient,private toasterService: ToastrService) { super("drawing-generator/", httpClient, toasterService );}


  // oem/f3d5e2f2-319e-ec11-a46b-a029191869f6/components



  GetComponentsByIdAsync(id: any): Promise<any> {
    return  this._httpClient.get(`${this.api_url}oem/${id}/components`)
        .toPromise();
  }

  GetCablesByIdAsync(id: any): Promise<any> {
    return  this._httpClient.get(`${this.api_url}oem/${id}/cables`)
        .toPromise();
  }


  GetParts(id: any): Promise<any> {
    return  this._httpClient.get(`${this.api_url}component/${id}/parts`).toPromise();
  }

  createDrawingData(drawingData: DataSavingModel): Observable<Blob> {

    const formData = new FormData();

 

    formData.append('te_pn', drawingData.te_pn);

    formData.append('cpn', drawingData.cpn);

    formData.append('project_number', drawingData.project_number);

    formData.append('id_oem', drawingData.id_oem);

    formData.append('id_harnessmaker', drawingData.id_harnesmaker);

    formData.append('c_pdf', drawingData.c_pdf);

    formData.append('p_pdf', drawingData.p_pdf);

    formData.append('image_drawing', drawingData.image_drawing);

 

 // Append componentsData

  for (let i = 0; i < drawingData.connectors.length; i++) {

    formData.append('componentsData', JSON.stringify(drawingData.connectors[i]));

  }
  for (let i = 0; i < drawingData.leads.length; i++) {

    formData.append('leads', JSON.stringify(drawingData.leads[i]));

  }
  for (let i = 0; i < drawingData.pinning.length; i++) {

    formData.append('pinning', JSON.stringify(drawingData.pinning[i]));

  }
  for (let i = 0; i < drawingData.bom.length; i++) {

    formData.append('bom', JSON.stringify(drawingData.bom[i]));

  }

 

    return this.httpClient.post(`${this.api_url}`, formData, { responseType: 'blob' });

  }

 
}
