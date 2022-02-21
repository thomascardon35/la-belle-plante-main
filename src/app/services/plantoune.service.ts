import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlantouneService {
  plantLiked$ = new Subject<any>();
  apiUrl: string;
  
  constructor(private httpClient: HttpClient) { 
    
    this.apiUrl = environment.apiUrl;
  }

  getData(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${environment.apiUrl}/list_products`);
  }

  getProductById(product_id: any): Observable<any[]> {

    return this.httpClient.get<any[]>(`${this.apiUrl}/list_products?product_id=${product_id}`)
    
  }

  getPlantFav(userId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/favPlant?userId=${userId}`)
  }

}
