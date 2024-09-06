import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormControl, ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ControlGrid } from './interfaces/controlGrid';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatExpansionModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent {

  controlGridList: ControlGrid[] = [];

  // controles para el grid
  rows = new FormControl(4);
  columns = new FormControl(4);
  rowGap = new FormControl(0);
  columnGap = new FormControl(0);

  subscriptions = new Subscription();

  constructor() {
    this.subscriptions.add(
      this.rows.valueChanges.subscribe( value => {
        if(!value){ value= 1}
        this.controlGridList = [];
        this.createControlGrid();
      })
    )

    this.subscriptions.add(
      this.columns.valueChanges.subscribe(value => {
        if(!value){value = 1}
        this.controlGridList = [];
        this.createControlGrid();
      })
    )

    this.subscriptions.add(
      this.rowGap.valueChanges.subscribe(value => {
        if(!value){ value = 0}
        this.controlGridList = [];
        this.createControlGrid();
      })
    )

    this.subscriptions.add(
      this.columnGap.valueChanges.subscribe(value => {
        if(!value){value = 0}
        this.controlGridList = [];
        this.createControlGrid();
      })
    )

  }

  ngOnInit() {
    this.createControlGrid();
  }

  getEstilos() {
    return {
      'grid-template-rows': `repeat(${this.rows.value}, 1fr)`,
      'grid-template-columns': `repeat(${this.columns.value}, 1fr)`,
      'row-gap': `${this.rowGap.value}px`,
      'column-gap': `${this.columnGap.value}px`
    }
  }

  createControlGrid() {
    if (this.rows.value && this.columns.value) {
      for (let i = 1; i <= this.rows.value * this.columns.value; i++) {
        this.controlGridList.push({
          id: i,
          index: i
        })
      }
    }

  }

}
