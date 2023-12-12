import { Injectable } from '@angular/core';
import {AsyncRepository, message} from "../../../../../../Persistence/Repository/AsyncRepository";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {BehaviorSubject, Observable} from "rxjs";
import { ComponentModel } from 'app/Domain/Entities/MasterData/Component.model';

@Injectable()
export class ComponentService extends AsyncRepository {

    public onPartsChange: BehaviorSubject<any>;
    public onCablesChange: BehaviorSubject<any>;


    constructor(private httpClient: HttpClient,private toasterService: ToastrService)
    {
        super("data/components", httpClient, toasterService);
        this.onPartsChange = new BehaviorSubject([]);
        this.onCablesChange = new BehaviorSubject([]);
    }

    
    QueryAsync(id: any, cableId?: string,  categoryId?: string): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this.api_url}/query?byOemId=${id}&cableId=${cableId}&categoryId=${categoryId}`);
    }

    
    GetByOemIdAsync(id: any): any {
        return this._httpClient.get(`${this.api_url}/query?byOemId=${id}`);
    }

    GetPartsByIdAsync(id: any):any {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.api_url}/${id}/parts`).subscribe((response: any) => {
                this.onPartsChange.next(response.parts);
                resolve(response.parts);
            }, reject);
        });
    }
    CreatePartAsync(part: any) {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${this.api_url}/parts`,part).subscribe(
                (response: message) => {
                    this.GetPartsByIdAsync(part.fK_ComponentId);
                    resolve(response);
                    this.ShowMessage(response.message,true);
                },
                err =>   this.ShowMessage("server is not responding",false)

            ),reject});
    }
    DeletePartAsync(part: any) {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(`${this.api_url}/parts/${part.fK_PartId}`).subscribe(
                (response: message) => {
                    this.GetPartsByIdAsync(part.fK_ComponentId);
                    resolve(response);
                    this.ShowMessage(response.message,true);
                },
                err =>   this.ShowMessage("server is not responding , please try again !",false)

            ),reject});
    }

    GetCablesByIdAsync(id: any):any {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.api_url}/${id}/cables`).subscribe((response: any) => {
                this.onCablesChange.next(response.cables);
                resolve(response.cables);
            }, reject);
        });
    }
    CreateCableAsync(cable: any) {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${this.api_url}/cables`,cable).subscribe(
                (response: message) => {
                    this.GetCablesByIdAsync(cable.fK_ComponentId);
                    resolve(response);
                    this.ShowMessage(response.message,true);
                },
                err =>   this.ShowMessage("server is not responding , please try again !",false)

            ),reject});
    }
    DeleteCableAsync(cable: any) {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(`${this.api_url}/cables/${cable.fK_CableId}`).subscribe(
                (response: message) => {
                    this.GetCablesByIdAsync(cable.fK_ComponentId);
                    resolve(response);
                    this.ShowMessage(response.message,true);
                },
                err =>   this.ShowMessage("server is not responding , please try again !",false)

            ),reject});
    }






    /*    GetPartsByIdAsync(id: any): any {
            return this._httpClient.get(`${this.api_url}/${id}/parts`);
        }*/

    /*CreatePartAsync(item: any,node_id: any): Promise<void> {
        return this._httpClient.post(`${this.api_url}/parts`,item)
            .toPromise()
            .then((res: message) => { // Success
                    this.ShowMessage(res.message,true);
                },
                () => { // Error
                    //   this.GetPartsByIdAsync(node_id);
                    this.ShowMessage("server is not responding",false);
                });
    }*/
    /*
        DeletePartAsync(id: any,node_id: any): Promise<void> {
        return this._httpClient.delete(`${this.api_url}/parts/${id}`)
            .toPromise()
            .then((res: message) => { // Success
                 // this.GetPartsByIdAsync(node_id);
                  this.ShowMessage(res.message,true);
                },
                () => { // Error
                  //this.GetPartsByIdAsync(node_id);
                  this.ShowMessage("server is not responding",false);
                });
      }
    */
    /*    UpdatePartAsync(item: any,node_id: any): Promise<void> {
          console.log(item);
            return this._httpClient.patch(`${this.api_url}/parts/${node_id}`,item)
                .toPromise()
                .then((res: message) => { // Success
                        this.GetPartsByIdAsync(node_id);
                        this.ShowMessage(res.message,true);
                    },
                    () => { // Error
                        this.GetPartsByIdAsync(node_id);
                        this.ShowMessage("server is not responding",false);
                    });
        }*/





}