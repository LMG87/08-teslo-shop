import { Component, inject, signal } from '@angular/core';
import { ProductTableComponent } from '../../../products/components/product-table/product-table.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
  styleUrl: './products-admin-page.component.css',
})
export class ProductsAdminPageComponent {
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  limit = signal(10);

  setLimit = (limit: string) => {
    this.limit.set(Number(limit));
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
