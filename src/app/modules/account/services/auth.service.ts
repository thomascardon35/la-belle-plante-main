import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
  private tokenKey: string;

  constructor(private http: HttpClient, private router: Router) {
    // On se sert des variables d'environnement de notre application 
    this.apiUrl = environment.apiUrl;
    this.tokenKey = environment.tokenKey;
   }

   signup(newUser: User): Observable<any> {
    //  const body = {
    //     firstName: firstName,
    //     lastName: lastName,
    //     email: email,
    //     password: password
    //  };

     console.log("Mon nouvel utilisateur : ", newUser);

     return this.http.post(`${this.apiUrl}/register`, newUser);
   }

   signin(email: string, password: string): Observable<any> {
     const body = {
       email: email,
       password: password
     };

     console.log("Mon body : ", body);

     // Modifier cette partie ci-dessous : 
     // - pour pouvoir stocker dans le localstorage notre accesstoken
     // - Sous la clé "TOKEN-LBP"

     return this.http.post(`${this.apiUrl}/login`, body).pipe(
       map((x: any) => {
         console.log('Service : ', x.accessToken);
         // Modification à faire ici 
         localStorage.setItem(this.tokenKey, x.accessToken);
         return x; // permet de renvoyer la réponse à l'initiateur (page Signin) après le traitement du map
        })
     );
   }

   forgotPassword(email: string, password: string): Observable<any> {
     const body = {
       email: email,
       password: password
     };

     console.log("Mon body : ", body);

     return this.http.post(`${this.apiUrl}/forgot-psw`, body);
   }

   getConnectedUserInfo(): Observable<User> | void  {
    const token = localStorage.getItem(this.tokenKey);
    if(token) {
      const decodedToken = jwt_decode<any>(token);
      const userId = decodedToken.sub;
      return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
    } else {
      this.router.navigate(['account/signin']);
    }
   }
   
}
