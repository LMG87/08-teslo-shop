import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { ProductsService } from '@products/services/products.service';
import {
  Gender,
  Product,
} from '../../../products/interfaces/product.interface';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css',
})
export class ProductPageComponent {
  idSlug = input.required<string>();
  private productsService = inject(ProductsService);

  productResource = rxResource({
    request: () => ({ idSlug: this.idSlug() }),
    loader: ({ request }) => {
      return this.productsService.getProduct(request.idSlug);
    },
  });
}
