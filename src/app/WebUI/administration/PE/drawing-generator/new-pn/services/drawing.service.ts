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


 
}
