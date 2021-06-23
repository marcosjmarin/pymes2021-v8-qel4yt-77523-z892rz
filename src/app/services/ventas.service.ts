import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { of } from 'rxjs';
import { Ventas } from '../models/ventas';

@Injectable()
export class VentasService {

  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourceUrl = 'https://pav2.azurewebsites.net/api/ventas/';

  }

  get() {
    return this.httpClient.get(this.resourceUrl);
  }
  
  getById(Id: number) {
    return this.httpClient.get(this.resourceUrl + Id);
  }
  
  post(obj: Ventas) {
    return this.httpClient.post(this.resourceUrl, obj);
  }
  
  put(Id: number, obj: Ventas) {
    return this.httpClient.put(this.resourceUrl + Id, obj);
  }
  
  delete(Id) {
    return this.httpClient.delete(this.resourceUrl + Id);
  }
  
  

}

