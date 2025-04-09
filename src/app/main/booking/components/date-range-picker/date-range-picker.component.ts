import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css'],
})
export class DateRangePickerComponent {
  private calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  @Input() fromDate: NgbDate | null = this.calendar.getToday();
  @Input() toDate: NgbDate | null = this.calendar.getNext(
    this.calendar.getToday(),
    'd',
    10
  );

  @Output() rangeSelected = new EventEmitter<{
    fromDate: NgbDate | null;
    toDate: NgbDate | null;
  }>();

  hoveredDate: NgbDate | null = null;

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    // Emit the new date range
    this.rangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });
  }

  isHovered(date: NgbDate): boolean {
    return !!(
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate): boolean {
    return !!(
      this.toDate &&
      date.after(this.fromDate) &&
      date.before(this.toDate)
    );
  }

  isRange(date: NgbDate): boolean {
    return !!(
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }
}
