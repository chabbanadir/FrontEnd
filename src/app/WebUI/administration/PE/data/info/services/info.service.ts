import { InfoModule } from './../info.module';
import { Injectable } from '@angular/core';
import {AsyncRepository} from "../../../../../../Persistence/Repository/AsyncRepository";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
  
})

export class InfoService extends AsyncRepository {
  
  url = 'https://localhost:5001/api/infos';
  constructor(private httpClient: HttpClient, private toasterService: ToastrService) { super("data/infos", httpClient, toasterService );}

infos(){
  return this.httpClient.get(this.url);
}
// saveInfos(data:any){
//   return this._httpClient.post(this.url, data);
// }

public saveInfos(info: InfoModule): Observable<any> {
  const url = 'https://localhost:5001/api/index.html#/Infos/Infos_GetAll';
  return this.httpClient.post<any>(url, info);
}


// public saveInfos(info: InfoModule): Observable<any> {
//   const url = 'https://localhost:5001/api';
//   return this.httpClient.post<any>(url, info);
// }


  // GetByOemIdAsync(id: any): any {
  //   return this._httpClient.get(`${this.api_url}/query?byOemId=${id}`);
  //   };





  //   QueryAsync(id: any, cableId?: string,  categoryId?: string): Observable<any[]> {
  //     return this._httpClient.get<any[]>(`${this.api_url}/query?byOemId=${id}&cableId=${cableId}&categoryId=${categoryId}`);
  // }

  
  GetByOemIdAsync(id: any): any {
      return this._httpClient.get(`${this.api_url}/query?byOemId=${id}`);
  }


  GetByHarnessMakerIdAsync(id: any): any {
    return this._httpClient.get(`${this.api_url}/query?byHarnessMakerId=${id}`);
}
     
  
  CreateAsync(id: any): any {
      //return  this._httpClient.post(`${this.api_url}/query?byOemId=${id}`);
      //return this._httpClient.post(`${this.api_url}/query?byOemId=${id}`);
    
            }
  }