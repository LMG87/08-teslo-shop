import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {
  protected http = inject(HttpClient);
  protected apiUrl = environment.baseUrl;
}
