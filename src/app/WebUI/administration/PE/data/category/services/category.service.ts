import { Injectable } from '@angular/core';
import {AsyncRepository} from "../../../../../../Persistence/Repository/AsyncRepository";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class CategoryService extends AsyncRepository {
  constructor(private httpClient: HttpClient,private toasterService: ToastrService) { super("data/categories", httpClient, toasterService );}
}