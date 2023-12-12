import { Injectable } from '@angular/core';
import {AsyncRepository} from "../../../../../../Persistence/Repository/AsyncRepository";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class ConfigurationService extends AsyncRepository {
  constructor(private httpClient: HttpClient,private toasterService: ToastrService) { super("data/configurations", httpClient, toasterService );}


  GetByOemIdAsync(id: any): any {
    return this._httpClient.get(`${this.api_url}/query?byOemId=${id}`);
    };


/*  GetByOemIdAsync(id: any): any {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.api_url}/query?byOemId=${id}`)
    });
  }*/
}