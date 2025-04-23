import { Component, effect, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
import { Gender } from '../../../products/interfaces/product.interface';
import { ProductCardComponent } from '../../../products/components/product-card/product-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
  styleUrl: './gender-page.component.css',
})
export class GenderPageComponent {
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  gender = input.required<Gender>();
  limit = signal(8);

  setLimit = (limit: number) => {
    this.limit.set(limit);
  };
  productsResource = rxResource({
    request: () => ({
      gender: this.gender(),
      page: this.paginationService.currentPage(),
      limit: this.limit(),
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        limit: request.limit,
        offset: (request.page - 1) * request.limit,
        gender: request.gender,
      });
    },
  });
}
