import { Injectable } from '@angular/core';
import {AsyncRepository} from "../../../../../../Persistence/Repository/AsyncRepository";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class CableService extends AsyncRepository {
  constructor(private httpClient: HttpClient,private toasterService: ToastrService) { super("data/cables", httpClient, toasterService );}

  GetByOemIdAsync(id: any): any {
    return this._httpClient.get(`${this.api_url}/query?byOemId=${id}`);
  };

}
