import { Component, ElementRef, QueryList, signal, ViewChildren } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormControl, ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ControlGrid } from './interfaces/controlGrid';
import { MatIconModule } from '@angular/material/icon';
import { itemGrid } from './interfaces/itemGrid';
import { CdkDragEnd, CdkDragMove, CdkDragStart, DragDropModule, DragRef, Point } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatExpansionModule, ReactiveFormsModule, FormsModule,
    CommonModule, MatIconModule, DragDropModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent {

  controlGridList: ControlGrid[] = [];
  addedElementsList: itemGrid[] = [];

  @ViewChildren('elementControl') elements!: QueryList<ElementRef>;

  // controles para el grid
  rows = new FormControl(3);
  columns = new FormControl(4);
  rowGap = new FormControl(0);
  columnGap = new FormControl(0);

  subscriptions = new Subscription();

  previusPosition = { x: 0, y:0};
  dragPosition = signal({ x: 0, y: 0 });

  constructor() {
    this.subscriptions.add(
      this.rows.valueChanges.subscribe(value => {
        if (!value) { value = 1 }
        this.controlGridList = [];
        this.createControlGrid();
      })
    )

    this.subscriptions.add(
      this.columns.valueChanges.subscribe(value => {
        if (!value) { value = 1 }
        this.controlGridList = [];
        this.createControlGrid();
      })
    )

    this.subscriptions.add(
      this.rowGap.valueChanges.subscribe(value => {
        if (!value) { value = 0 }
        this.controlGridList = [];
        this.createControlGrid();
      })
    )

    this.subscriptions.add(
      this.columnGap.valueChanges.subscribe(value => {
        if (!value) { value = 0 }
        this.controlGridList = [];
        this.createControlGrid();
      })
    )

    this.createControlGrid();
  }

  ngAfterViewInit() {
    this.elements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element.nativeElement);
      const gridColumnStart = computedStyle.getPropertyValue('grid-column-start');
      const gridRowStart = computedStyle.getPropertyValue('grid-row-start');
    });
  }

  getGridStyles() {
    return {
      'grid-template-rows': `repeat(${this.rows.value}, 1fr)`,
      'grid-template-columns': `repeat(${this.columns.value}, 1fr)`,
      'row-gap': `${this.rowGap.value}px`,
      'column-gap': `${this.columnGap.value}px`
    }
  }

  onDragEnded(event: CdkDragEnd, item: itemGrid) {
    const gridElement = document.querySelector('.grid-interactive') as HTMLElement;

    const gridRect = gridElement.getBoundingClientRect();
    const elementRect = event.source.element.nativeElement.getBoundingClientRect();



    if (!this.columns.value || !this.rows.value) {
      return;
    }

    // Tamaño de cada celda en la cuadrícula
    const cellWidth = gridRect.width / this.columns.value;
    const cellHeight = gridRect.height / this.rows.value;

    // Obtener la posición donde terminó el drag

    const newColumn = Math.round((elementRect.left - gridRect.left) / cellWidth) + 1;
    const newRow = Math.round((elementRect.top - gridRect.top) / cellHeight) + 1;

    // Asegurarse de que el elemento no se salga del grid
    item.column = Math.max(1, Math.min(newColumn, this.columns.value));
    item.row = Math.max(1, Math.min(newRow, this.rows.value));

    // Forzar actualización del grid

    event.source.element.nativeElement.style.transform = '';

    this.previusPosition.x = elementRect.left;
    this.previusPosition.y = elementRect.top;

    console.log('previusPosition x',  this.previusPosition.x  );
    console.log('previusPosition y', this.previusPosition.y);

    console.log(this.addedElementsList)
  }


  onDragStarted(event: CdkDragStart, item: itemGrid) {
    console.log("started")
    this.dragPosition.update(current => {
      const newPosition = {
        x: 0,
        y: 0
      };
      console.log('Actualizando a:', newPosition);
      return newPosition;
    });
  }

  cdkDragMoved(event: CdkDragMove, item: itemGrid) {

  }


  createNewElement(index: number) {
    const element = this.controlGridList.find(el => el.id === index);
    if (element) {
      this.addedElementsList.push({
        color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 80)} , ${Math.floor(Math.random() * 256)}, 0.5)`,
        column: element.column,
        row: element.row,
        id: this.addedElementsList.length + 1
      });
    }
  }

  createControlGrid() {
    if (this.rows.value && this.columns.value) {
      let columIndex = 1;
      let rowIndex = 1;
      for (let i = 1; i <= this.rows.value * this.columns.value; i++) {
        this.controlGridList.push({
          id: i,
          row: rowIndex,
          column: columIndex
        })

        columIndex += 1;

        if (columIndex > this.columns.value) {
          columIndex = 1;
          rowIndex += 1;
        }
      }
    }
  }
}
