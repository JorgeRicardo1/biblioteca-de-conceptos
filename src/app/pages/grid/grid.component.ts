import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormControl, ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatExpansionModule, ReactiveFormsModule, FormsModule,CommonModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent {

  // controles para el grid
  rows = new FormControl(4);
  columns = new FormControl(4);
  rowGap = new FormControl(0);
  columnGap = new FormControl(0);


  constructor() {
    console.log('aca', this.rows.value)
    console.log(this.getEstilos())
  }

  getEstilos() {
    return {
      'grid-template-rows' : `repeat(${this.rows.value}, 1fr)`,
      'grid-template-columns' : `repeat(${this.columns.value}, 1fr)`
    }
  }



}
