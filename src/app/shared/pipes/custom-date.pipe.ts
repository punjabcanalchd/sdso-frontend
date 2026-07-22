import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({ name: 'customDate' })
export class CustomDatePipe implements PipeTransform {
  transform(value: string | Date, format: string = 'mediumDate'): string {
    return formatDate(value, format, 'en-US');
  }
}
