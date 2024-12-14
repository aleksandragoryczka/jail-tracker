import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedTableData } from 'src/app/models/shard-table-data.model';

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss'],
})
export class SharedTableComponent {
  @Input() caption!: string;
  @Input() headers!: string[];
  @Input() data!: SharedTableData[];
  @Input() currentPage!: number;
  @Input() totalNumberOfPages!: number;
  rowsPerPage = 10;

  @Output() prevPageEvent = new EventEmitter<number>();
  @Output() nextPageEvent = new EventEmitter<number>();

  prevPage(): void {
    if (this.currentPage > 0) this.prevPageEvent.emit(--this.currentPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalNumberOfPages - 1)
      this.nextPageEvent.emit(++this.currentPage);
  }

  getStartRowIndex(): number {
    return this.currentPage * this.rowsPerPage + 1;
  }
}
