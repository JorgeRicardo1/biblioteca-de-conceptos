import { Component, ElementRef, HostListener, QueryList, signal, ViewChildren } from '@angular/core';
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
import { MatRadioModule } from '@angular/material/radio';
import { RowGrid } from './interfaces/rowGrid';
import {MatButtonModule} from '@angular/material/button';
import { ColumnGrid } from './interfaces/columnGrid';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';



@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatExpansionModule, ReactiveFormsModule, FormsModule,
    CommonModule, MatIconModule, DragDropModule, MatRadioModule, MatButtonModule, MatSelectModule, MatMenuModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent {

  controlGridList: ControlGrid[] = [];
  addedElementsList: itemGrid[] = [];

  @ViewChildren('elementControl') elements!: QueryList<ElementRef>;

  // controles para el grid
  rows = new FormControl(3);
  columns = new FormControl(2);
  rowGap = new FormControl(0);
  columnGap = new FormControl(0);

  subscriptions = new Subscription();

  currentItem: itemGrid = {
    id: 0,
    color: 'red',
    row: 0,
    column: 0,
    rowSpan: 0,
    columnSpan: 0,
    selected: false,
    alingSelf: 'stretch',
    justifySelf: 'stretch'
  }

  //propiedades para el resizing de los items
  resizing = false;
  startX = 0;
  startY = 0;
  originalWidth = 0;
  originalHeight = 0;
  dragPosition = signal({ x: 0, y: 0 });

  //propiedades del contenedor grid
  justifyItemsOption = "stretch";
  alignItemsOption = "stretch";
  alignContentOption = "start";
  justifyContentOption = "start";

  //propiedades del item dentro de un contenedor grid
  justifySelfOption = "stretch";
  alignSelfOption = "stretch";

  //lista de columnas y filas de el grid
  rowsList: RowGrid[] = [{ magnitude: "fr", value: 1 }, { magnitude: "fr", value: 1 }, { magnitude: "fr", value: 1 }];
  columnsList: ColumnGrid[] = [{ magnitude: "fr", value: 1 }, { magnitude: "fr", value: 1 }];

  constructor() {
    this.subscriptions.add(
      this.rows.valueChanges.subscribe(value => {
        if (!value) { value = 1 }
        this.controlGridList = [];
        this.createControlGrid();
        if (value > this.rowsList.length) {
          this.rowsList.push({
            magnitude : "fr",
            value : 1
          })
        }
        else if(value < this.rowsList.length){
          const length = this.rowsList.length;
          this.rowsList.splice(length - 1, 1);
        }
        console.log(this.rowsList);
      })
    )

    this.subscriptions.add(
      this.columns.valueChanges.subscribe(value => {

        if (!value) { value = 1 }
        this.controlGridList = [];
        this.createControlGrid();
        if (value > this.columnsList.length) {
          this.columnsList.push({
            magnitude : "fr",
            value : 1
          })
        }
        else if(value < this.columnsList.length){
          const length = this.columnsList.length;
          this.columnsList.splice(length - 1, 1);
        }
        console.log(this.columnsList);
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
      'grid-template-rows': this.generateStringRows(),
      'grid-template-columns': this.generateStringColumns(),
      'row-gap': `${this.rowGap.value}px`,
      'column-gap': `${this.columnGap.value}px`,

    }
  }

  getGridStylesInteractive() {
    return {
      'grid-template-rows': this.generateStringRows(),
      'grid-template-columns': this.generateStringColumns(),
      'row-gap': `${this.rowGap.value}px`,
      'column-gap': `${this.columnGap.value}px`,
      'justify-items': this.justifyItemsOption,
      'align-items': this.alignItemsOption,
      'justify-content': this.justifyContentOption,
      'align-content': this.alignContentOption
    }
  }

  getItemStyle(item: itemGrid) {
    return {
      'grid-row': item.row + ' / span ' + item.rowSpan,
      'grid-column': item.column + ' / span ' + item.columnSpan,
      'background-color': item.color,
      'justify-self': item.justifySelf,
      'align-self': item.alingSelf,
    }
  }

  itemSelected(item: itemGrid) {
    this.currentItem = item;
    this.addedElementsList.forEach(element => {
      element.selected = false;
    });
    this.currentItem.selected = true;
  }

  justifySelfChange(value: string) {
    this.currentItem.justifySelf = value;
  }

  alignSelfChange(value: string) {
    this.currentItem.alingSelf = value;
  }

  //funcion que se inicia para alargar o hacer mas pequeño un item dentro del grid
  startResize(event: MouseEvent, item: itemGrid): void {
    this.resizing = true;
    this.currentItem = item;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.originalWidth = item.columnSpan;
    this.originalHeight = item.rowSpan;

    // Prevenir selección de texto mientras se redimensiona
    event.preventDefault();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.resizing) return;

    // Cambiar el cursor a modo de redimensionar
    document.body.style.cursor = 'nwse-resize';

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    const gridElement = document.querySelector('.grid-interactive') as HTMLElement;
    if (!gridElement || !this.columns.value || !this.rows.value) return;

    const gridRect = gridElement.getBoundingClientRect(); //obtenemos el tamaño de el grid
    const cellWidth = gridRect.width / this.columns.value; // tamaño de cada cuadricula
    const cellHeight = gridRect.height / this.rows.value;


    // Calcular nuevas dimensiones en función del arrastre
    const newColumnSpan = Math.max(1, Math.round(this.originalWidth + deltaX / cellWidth));
    const newRowSpan = Math.max(1, Math.round(this.originalHeight + deltaY / cellHeight));

    this.currentItem.columnSpan = newColumnSpan;
    this.currentItem.rowSpan = newRowSpan;
  }

  @HostListener('window:mouseup')
  onMouseUp(): void {
    if (this.resizing) {
      // Restablecer el cursor al estilo por defecto
      document.body.style.cursor = 'default';
      this.resizing = false;
    }
  }

  removeElement(itemSended: itemGrid) {
    const index = this.addedElementsList.findIndex(item => item.id === itemSended.id);
    if (index !== -1) {
      this.addedElementsList.splice(index, 1);
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

    item.column = Math.max(1, Math.min(newColumn, this.columns.value));
    item.row = Math.max(1, Math.min(newRow, this.rows.value));

    // Forzar actualización del grid
    event.source.element.nativeElement.style.transform = '';

  }


  onDragStarted(event: CdkDragStart, item: itemGrid) {
    this.currentItem = item;
    this.dragPosition.update(current => {
      const newPosition = {
        x: 0,
        y: 0
      };
      return newPosition;
    });
  }

  cdkDragMoved(event: CdkDragMove, item: itemGrid) {
    this.currentItem = item;
  }


  createNewElement(index: number) {
    const element = this.controlGridList.find(el => el.id === index);
    if (element) {
      this.addedElementsList.push({
        color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 80)} , ${Math.floor(Math.random() * 256)}, 0.5)`,
        column: element.column,
        row: element.row,
        id: this.addedElementsList.length + 1,
        rowSpan: 1,
        columnSpan: 1,
        selected: false,
        alingSelf: 'stretch',
        justifySelf: 'stretch'
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

  generateStringRows() : string{
    let stringRows = '';
    this.rowsList.forEach(row => {
      stringRows += ' ' +`${row.value}${row.magnitude}`
    });
    return stringRows;
  }

  generateStringColumns() : string{
    let stringColumns = '';
    this.columnsList.forEach(column => {
      stringColumns += ' ' +`${column.value}${column.magnitude}`
    })
    return stringColumns;
  }
}
