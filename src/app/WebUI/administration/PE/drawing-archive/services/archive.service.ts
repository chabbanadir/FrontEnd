import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataSavingModel } from 'app/Domain/Entities/DrawingGenerator/DataSaving.model';
import { User } from 'app/Identity/models';
import { AsyncRepository } from 'app/Persistence/Repository/AsyncRepository';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService extends AsyncRepository{

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(private http: HttpClient, private toasterService: ToastrService) {
    super("drawing-data/", http, toasterService); // Assuming superclass constructor

    // Initialize BehaviorSubject with the current user from local storage or null if not available
    // this.currentUserSubject = new BehaviorSubject<User>(
    //   JSON.parse(localStorage.getItem('currentUser'))
    // );
    
    // // Set currentUser as an observable to track changes in the current user
    // this.currentUser = this.currentUserSubject.asObservable();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).currentUser : null;

    // Set up the headers including the token
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  getAllDrawings(): Observable<any[]> {
    // console.log("JSON.parse(localStorage.getItem('currentUser')) : " + JSON.parse(localStorage.getItem('currentUser')).currentUser);
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.api_url}`, { headers: headers });
  }
  getById(id: string): Observable<any> {
    const url = `${this.api_url}${id}`;
    const headers = this.getHeaders();
    return this.http.get<any>(url, { headers: headers });
  }


  createDrawingData(drawingData: DataSavingModel): Observable<Blob> {

    const formData = new FormData();

 

    formData.append('te_pn', drawingData.te_pn);

    formData.append('cpn', drawingData.cpn);

    formData.append('project_number', drawingData.project_number);

    formData.append('id_oem', drawingData.id_oem);

    formData.append('id_harnessmaker', drawingData.id_harnesmaker);

    formData.append('c_pdf', drawingData.c_pdf);

    formData.append('p_pdf', drawingData.p_pdf);

    formData.append('image_drawing', drawingData.image_drawing);
    formData.append('rev', drawingData.Rev);

    formData.append('connectorDrawings', JSON.stringify(drawingData.connectors));
 
    formData.append('leads', JSON.stringify(drawingData.leads));

    formData.append('pinnings', JSON.stringify(drawingData.pinning));

    formData.append('boms', JSON.stringify(drawingData.bom));


  // formData.forEach((value, key) => {
  //   console.log(`Key: ${key}, Value: ${value}`);
    // });
    const headers = this.getHeaders();
    // Construct your formData as per your requirements

    return this.http.post(`${this.api_url}`, formData, { headers: headers, responseType: 'blob' });
  }
  

  updateDrawingData(drawingData: DataSavingModel , id:string): Observable<Blob> {

    const formData = new FormData();

 

    formData.append('id', drawingData.id);
    formData.append('te_pn', drawingData.te_pn);

    formData.append('cpn', drawingData.cpn);

    formData.append('project_number', drawingData.project_number);

    formData.append('id_oem', drawingData.id_oem);

    formData.append('id_harnessmaker', drawingData.id_harnesmaker);

    formData.append('c_pdf', drawingData.c_pdf);

    formData.append('p_pdf', drawingData.p_pdf);

    formData.append('image_drawing', drawingData.image_drawing);
    formData.append('rev', drawingData.Rev);

 

 // Append componentsData


    formData.append('connectorDrawings', JSON.stringify(drawingData.connectors));

    formData.append('leads', JSON.stringify(drawingData.leads));


    formData.append('pinnings', JSON.stringify(drawingData.pinning));

    formData.append('boms', JSON.stringify(drawingData.bom));

 
    const headers = this.getHeaders();

 // Send the request with headers
    return this.http.put(`${this.api_url}${id}`, formData, { headers: headers, responseType: 'blob' });
  } 

}
