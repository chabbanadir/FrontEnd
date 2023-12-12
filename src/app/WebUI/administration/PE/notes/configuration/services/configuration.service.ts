import { Injectable } from '@angular/core';
import {AsyncRepository} from "../../../../../../Persistence/Repository/AsyncRepository";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class ConfigurationNotesService extends AsyncRepository {
  constructor(private httpClient: HttpClient,private toasterService: ToastrService) { super("data/notes", httpClient, toasterService );}


  GetByType(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${this.api_url}/type/3`).subscribe((response: any) => {
        this.onItemChange.next(response);
        resolve(response);
      }, reject);
    });
  }
}