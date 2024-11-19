import { Directive, HostListener } from '@angular/core';
import { SvcBackbuttonService } from '../services/services/svc-backbutton.service';

@Directive({
  selector: '[backbutton]'
})
export class BackButtonDirective {

  constructor(private backbutton: SvcBackbuttonService) { }
  @HostListener('click')
  onClick(): void {
      this.backbutton.back()
  }


}
