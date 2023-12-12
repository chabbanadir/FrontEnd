import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AsyncRepository} from "../../../../../../Persistence/Repository/AsyncRepository";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class OemService extends AsyncRepository {
    constructor(private httpClient: HttpClient,private toasterService: ToastrService) { super("data/oems", httpClient, toasterService );}
}
