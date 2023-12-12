import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncRepository } from 'app/Persistence/Repository/AsyncRepository';
import { Drawing, drawingToString } from 'app/Domain/Entities/Drawing-data/Drawing.model';

@Injectable({
  providedIn: 'root'
})
export class DrawingService extends AsyncRepository {
  public onDrawingsChange: BehaviorSubject<any>;

  constructor(private httpClient: HttpClient, private toasterService: ToastrService) {
    super('drawing-Data', httpClient, toasterService);
    this.onDrawingsChange = new BehaviorSubject([]);
  }

  getAllAsync(): Promise<any[]> {
    return this.httpClient.get<any[]>(`${this.api_url}/`).toPromise();
  }

  getDrawingById(id: string): Promise<Drawing> {
    const url = `${this.api_url}/${id}`; // Adjust the URL endpoint according to your API
    return this.httpClient.get<Drawing>(url).toPromise();
  }

  createDrawingData(drawingData: Drawing): Observable<Blob> {
    const formData = new FormData();

    formData.append('tePartNumber', drawingData.tePartNumber);
    formData.append('customerPN', drawingData.customerPN);
    formData.append('projectNumber', drawingData.projectNumber);
    formData.append('oem', drawingData.oem);
    formData.append('harnessMaker', drawingData.harnessMaker);
    formData.append('numberOfConnectors', drawingData.numberOfConnectors.toString());

    formData.append('cdPath', drawingData.cdPath);
    formData.append('pdPath', drawingData.pdPath);

    formData.append('excelFilePath', drawingData.excelFilePath);
    formData.append('imagePath', drawingData.imagePath);

 // Append componentsData
  for (let i = 0; i < drawingData.componentsData.length; i++) {
    formData.append('componentsData', JSON.stringify(drawingData.componentsData[i]));
  }

  // Append cablesData
  // Convert pd_lengths data to JSON strings
  formData.append('cablesData', JSON.stringify(drawingData.cablesData));
  
  // Convert pd_lengths data to JSON strings
  formData.append('pd_lengths', JSON.stringify(drawingData.pd_lengths));

  // Convert cd_lengths data to JSON strings
  formData.append('cd_lengths', JSON.stringify(drawingData.cd_lengths));

  // Convert pinning data to JSON strings
  formData.append('pinning', JSON.stringify(drawingData.pinning));
  
  // Convert smartAssembly data to JSON strings
  formData.append('smartAssembly', JSON.stringify(drawingData.Bom));

    return this.httpClient.post(`${this.api_url}`, formData, { responseType: 'blob' });
  }
  
}
