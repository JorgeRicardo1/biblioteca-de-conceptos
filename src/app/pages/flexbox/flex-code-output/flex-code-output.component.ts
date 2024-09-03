import { Component } from '@angular/core';

@Component({
  selector: 'app-flex-code-output',
  standalone: true,
  imports: [],
  templateUrl: './flex-code-output.component.html',
  styleUrl: './flex-code-output.component.css'
})
export class FlexCodeOutputComponent {
  codigoGenerado =  `ngOnDestroy() {
    this.subscriptions.unsubscribe();
  };`
}
