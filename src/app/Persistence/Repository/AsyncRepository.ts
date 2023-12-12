import {IAsyncRepository} from "../../Application/Contracts/Persistence/IAsyncRepository";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import { BehaviorSubject, Observable } from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {ToastrService} from "ngx-toastr";

export interface message {
    message: string,
    title: string,
    Succeed: boolean
}
export abstract class AsyncRepository implements IAsyncRepository , Resolve<any>{

    public api_url: string;
    public onItemsChange: BehaviorSubject<any>;
    public onItemChange: BehaviorSubject<any>;

    protected constructor(private api_route: string, public _httpClient: HttpClient,private _toasterService: ToastrService)
    {
        this.onItemsChange = new BehaviorSubject([]);
        this.onItemChange = new BehaviorSubject([]);
        this.api_url = `${environment.apiUrl}/${api_route}`;
    }


    GetAllAsync():any {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.api_url).subscribe((response: any) => {
                this.onItemsChange.next(response);
                resolve(response);
            }, reject);
        });
    }
    GetByIdAsync(id: any): any {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.api_url}/${id}`).subscribe((response: any) => {
                this.onItemChange.next(response);
                resolve(response);
            }, reject);
        });
    }
    CreateAsync(entity: any): Promise<void> {
        return  this._httpClient.post(this.api_url, entity)
            .toPromise()
            .then((res: message) => { // Success
                    this.GetAllAsync();
                    this.ShowMessage(res.message,true);
                },
                () => { // Error
                    this.GetAllAsync();
                    this.ShowMessage("server is not responding",false);
                });
    }
    UpdateAsync(entity: any, Id:any): Promise<void> {
        return  this._httpClient.put(`${this.api_url}/${Id}`, entity)
            .toPromise()
            .then((res: message) => { // Success
                    this.GetAllAsync();
                    this.ShowMessage(res.message,true);
                },
                () => { // Error
                    this.GetAllAsync();
                    this.ShowMessage("server is not responding",false);
                });
    }
    UpdateDetailsAsync(entity: any, Id:any): Promise<void> {
        return  this._httpClient.put(`${this.api_url}/${Id}/Details`, entity)
            .toPromise()
            .then((res: message) => { // Success
                    this.GetAllAsync();
                    this.ShowMessage(res.message,true);
                },
                () => { // Error
                    this.GetAllAsync();
                    this.ShowMessage("server is not responding",false);
                });
    }
    PatchAsync(entity: any, Id:any): Promise<void> {
        return  this._httpClient.patch(`${this.api_url}/${Id}`, entity)
            .toPromise()
            .then((res: message) => { // Success
                    this.GetAllAsync();
                    this.ShowMessage(res.message,true);
                },
                () => { // Error
                    this.GetAllAsync();
                    this.ShowMessage("server is not responding",false);
                });
    }
    DeleteAsync(id: any): Promise<void> {
        return this._httpClient.delete(`${this.api_url}/${id}`)
            .toPromise()
            .then((res: message) => { // Success
            this.GetAllAsync();
            this.ShowMessage(res.message,true);
        },
                () => { // Error
            this.GetAllAsync();
            this.ShowMessage("server is not responding",false);
        });
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this.GetAllAsync()
            ]).then(() => {
                resolve();
            }, reject);
        });
    }





    ShowMessage(message: any, isSuccess: any) {
        setTimeout(() => {
            if(isSuccess)
            {
                this._toasterService.success(message,'Success',{toastClass: 'toast ngx-toastr', closeButton: true});
            }
            else
            {
                this._toasterService.error(message,'Error',{toastClass: 'toast ngx-toastr', closeButton: true});
            }
        }, 1000);
    }

}