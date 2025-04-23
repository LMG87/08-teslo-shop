import {
  Component,
  computed,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  optionsLmit = input<boolean>(true);
  pages = input(0);
  itemsPerPage = signal(8);
  limit = output<number>();
  currentPage = input<number>(1);
  activePage = linkedSignal<number>(this.currentPage);

  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });

  updateItemsPerPage = (itemsPerPage: string) => {
    this.itemsPerPage.set(Number(itemsPerPage));
    this.limit.emit(Number(itemsPerPage));
  };
}
