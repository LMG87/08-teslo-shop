import { Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import {
  Gender,
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

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

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

  getProductById(id: string): Observable<Product> {
    if (id === 'new') return of(emptyProduct);

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }
    return this.http
      .get<Product>(`${this.apiUrl}/products/${id}`)
      .pipe(tap((resp) => this.productCache.set(id, resp)));
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
  ): Observable<Product> {
    return this.http
      .patch<Product>(`${this.apiUrl}/products/${id}`, productLike)
      .pipe(tap((product) => this.updateProductCache(product)));
  }

  updateProductCache(product: Product, type = 0) {
    const productId = product.id;

    this.productCache.set(productId, product);

    if (type != 1) {
      this.productsCache.forEach((productResponse) => {
        productResponse.products = productResponse.products.map(
          (currentProduct) =>
            currentProduct.id === productId ? product : currentProduct,
        );
      });
    }
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http
      .post<Product>(`${this.apiUrl}/products`, productLike)
      .pipe(tap((product) => this.updateProductCache(product, 1)));
  }
}
