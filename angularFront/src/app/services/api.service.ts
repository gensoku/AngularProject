import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FilterParams } from '../models/filters';
import { MovieComment } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private SERVER_URL = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public getMovies(filterParams: FilterParams = {}){
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filterParams)) {
      params = params.set(key, value);
    }
		return this.httpClient.get(`${this.SERVER_URL}/movies`, { params });  
  }
  
  public getComments(id: String) {
    return this.httpClient.get(`${this.SERVER_URL}/movies/${id}/comments`); 
  }

  public postComment(id: string, comment: MovieComment) {
    return this.httpClient.post(`${this.SERVER_URL}/movies/${id}/comment`, comment);
  }
}
