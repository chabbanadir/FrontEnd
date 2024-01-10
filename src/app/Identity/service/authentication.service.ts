import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import {User} from "../models";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

/*  /!**
   *  Confirms if user is admin
   *!/
  get isAdmin() {
    console.log(this.currentUserSubject.value.role);
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }*/

/*  /!**
   *  Confirms if user is client
   *!/
  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  }*/

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    const formData = new FormData();
    formData.append('Email', email);
    formData.append('Password', password);
    return this._http
      .post<any>(`${environment.apiUrl}/Auth`,  formData)
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          console.log("1 user logs : "+  JSON.stringify(user));
          if (user.currentUser) {
            console.log("2 user currentUserlogs : "+ user.currentUser);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'You have successfully logged in as an ' +
                  user.role +
                  ' user.',
                '👋 Welcome, ' + user.unique_name + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);

            // notify
            this.currentUserSubject!.next(user);
          }

          return user;
        })
      );
  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
}
