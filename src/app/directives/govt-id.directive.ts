import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appGovtId]'
})
export class GovtIdDirective {

  @HostListener('input', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    let trimmed = input.value.replace(/\s+/g, '');

    if (trimmed.length > 18) {
      trimmed = trimmed.substr(0, 18);
    }


    trimmed = trimmed.replace(/-/g, '');

    let numbers = [];

    numbers.push(trimmed.substr(0, 5));
    if (trimmed.substr(5, 5) !== "")
      numbers.push(trimmed.substr(5, 4));
   if (trimmed.substr(9,9) != "")
      numbers.push(trimmed.substr(9,9));


    input.value = numbers.join('-');

  }

}
