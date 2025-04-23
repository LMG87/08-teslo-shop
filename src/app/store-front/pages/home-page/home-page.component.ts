import { Component, inject, signal } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Pagination } from 'swiper/modules';
import { PaginationService } from '../../../shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  limit = signal(8);

  setLimit = (limit: number) => {
    this.limit.set(limit);
  };
  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage(),
      limit: this.limit(),
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        limit: request.limit,
        offset: (request.page - 1) * request.limit,
      });
    },
  });
}
