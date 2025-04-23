import { Injectable } from '@angular/core';
import {
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';
import { BaseHttpService } from '@shared/services/base-http.service';
import { Observable, of, tap } from 'rxjs';

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends BaseHttpService {
  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${gender}-${offset}-${limit}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${this.apiUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(tap((resp) => this.productsCache.set(key, resp)));
  }

  getProduct(idSlug: string): Observable<Product> {
    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }
    return this.http
      .get<Product>(`${this.apiUrl}/products/${idSlug}`)
      .pipe(tap((resp) => this.productCache.set(idSlug, resp)));
  }
}
