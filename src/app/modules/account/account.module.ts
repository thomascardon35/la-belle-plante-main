import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { PageSigninComponent } from './pages/page-signin/page-signin.component';
import { PageSignupComponent } from './pages/page-signup/page-signup.component';
import { PageForgotPasswordComponent } from './pages/page-forgot-password/page-forgot-password.component';
import { PageResetPasswordComponent } from './pages/page-reset-password/page-reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageAccountComponent } from './pages/page-account/page-account.component';


@NgModule({
  declarations: [
    PageSigninComponent,
    PageSignupComponent,
    PageForgotPasswordComponent,
    PageResetPasswordComponent,
    PageAccountComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AccountModule { }
