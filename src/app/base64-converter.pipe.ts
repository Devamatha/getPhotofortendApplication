import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'base64Converter'
})
export class Base64ConverterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    if (value.startsWith('data:image')) return value;

    return 'data:image/jpeg;base64,' + btoa(value);
  }
}
