import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {CoreCommonModule} from '@core/common.module';
import {AuthForgotPasswordV2Component} from "./auth-forgot-password-v2/auth-forgot-password-v2.component";
import {AuthLoginV2Component} from "./auth-login-v2/auth-login-v2.component";
import {AuthResetPasswordV1Component} from "./auth-reset-password-v1/auth-reset-password-v1.component";


// routing
const routes: Routes = [
  {
    path: 'user/login',
    component: AuthLoginV2Component
  },
  {
    path: 'user/password',
    component: AuthForgotPasswordV2Component
  },
  {
    path: 'user/reset',
    component: AuthResetPasswordV1Component
  }
];

@NgModule({
  declarations: [
    AuthLoginV2Component,
    AuthForgotPasswordV2Component,
    AuthResetPasswordV1Component,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule]
})
export class AuthenticationModule {}
