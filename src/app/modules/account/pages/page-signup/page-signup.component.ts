import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-page-signup',
  templateUrl: './page-signup.component.html',
  styleUrls: ['./page-signup.component.scss']
})
export class PageSignupComponent implements OnInit {
  public signupForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.signupForm = new FormGroup({});
  }

  ngOnInit(): void {
    // FormGroupe => Group de champs de saisie (notre objet)
    // FormControl => Les champs de saisie (nos propriétés)
    this.signupForm = new FormGroup({
      firstNameFc : new FormControl(''),
      lastNameFc : new FormControl(''),
      emailFc : new FormControl('', [Validators.email, Validators.required, Validators.pattern(/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/igm)]), // chercher une meilleure regex
      passwordFc : new FormControl('', [Validators.minLength(8), Validators.required])
    })
  }

  public onSubmit(): void {
    console.log("value : ", this.signupForm.value);
    console.log("form : ", this.signupForm);
    const firstNameValue = this.signupForm.value['firstNameFc'];
    const lastNameValue = this.signupForm.value['lastNameFc'];
    const emailValue = this.signupForm.value['emailFc'];
    const passwordValue = this.signupForm.value['passwordFc'];
    
    const user: User = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      email: emailValue,
      password: passwordValue
    }

    if(user.email !== '' && user.password !== '') {
      this.authService.signup(user).subscribe(
        resp => {
          this.router.navigate(['account/signin'])
        }
      )
    } else {
      // affichage erreur
    }
  }

}
