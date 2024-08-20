import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-flexbox',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './flexbox.component.html',
  styleUrl: './flexbox.component.css'
})
export class FlexboxComponent {
  flexDirectionOption = 'row';
  justifyContentOption = 'flex-start';
  alignItemsOption = 'flex-start';
  flexWrapOption = 'wrap';
  numeroElementos =  new FormControl(1);

  elementosArray = Array(this.numeroElementos.value).fill(0);

  ngOnInit() {
    this.numeroElementos.valueChanges.subscribe(value => {
      this.elementosArray = Array(value).fill(0).map( (x, y) => y );
    });
  }

  onFlexDirectionChange(event: MatSelectChange) {
    console.log('flexDirectionOption changed:', event.value);
    // Puedes agregar más lógica aquí si es necesario
  }
}
