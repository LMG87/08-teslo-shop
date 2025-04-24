import { Component, effect, inject, input, linkedSignal } from '@angular/core';
import { Product } from '../../../products/interfaces/product.interface';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { routes } from '../../../app.routes';
import { Router } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetailComponent],
  templateUrl: './product-admin-page.component.html',
  styleUrl: './product-admin-page.component.css',
})
export class ProductAdminPageComponent {
  id = input.required<string>();
  productService = inject(ProductsService);
  router = inject(Router);

  ProductId = linkedSignal(this.id);

  productResource = rxResource({
    request: () => ({ id: this.ProductId() }),
    loader: ({ request }) => {
      return this.productService.getProductById(request.id).pipe(
        map((product: Product) => {
          return product;
        }),
      );
    },
  });

  redirectEEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  });
}
