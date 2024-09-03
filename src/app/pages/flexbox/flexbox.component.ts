import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { Item } from '../flexbox/interfaces/item-flex'
import { IfStmt } from '@angular/compiler';
import { FlexCodeOutputComponent } from "./flex-code-output/flex-code-output.component";


@Component({
  selector: 'app-flexbox',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, FormsModule, MatSelectModule, MatRadioModule,
    MatInputModule, ReactiveFormsModule, MatCheckboxModule, MatExpansionModule, FlexCodeOutputComponent],
  templateUrl: './flexbox.component.html',
  styleUrl: './flexbox.component.css',
  host: {}
})
export class FlexboxComponent {
  // propiedades del contenedor
  flexDirectionOption = 'row';
  justifyContentOption = 'flex-start';
  alignItemsOption = 'stretch';
  flexWrapOption = 'nowrap';
  alignContentOption = 'stretch';

  // propiedades del item
  flexGrowOption = new FormControl(0);
  flexShrinkOption = new FormControl(1);
  flexBasisOption = new FormControl('auto');
  alignSelfOption = 'auto';
  orderOption = new FormControl(0);
  itemHeightOption: FormControl<number | string> = new FormControl();
  ItemWidthOption = new FormControl(100);

  // controles de el flex exibidor
  numeroElementos = new FormControl(1);
  widthElementos = new FormControl(70);

  //variables para generar el codigo
  htmlCodeOutput = `ngOnDestroy() {
    this.subscriptions.unsubscribe();
  };`

  cssCodeOutput = `.flex-container {
      display: flex;
      flex-direction: ${this.flexDirectionOption};
      flex-wrap: ${this.flexWrapOption};
      justify-content: ${this.alignContentOption};
      align-items: ${this.alignItemsOption};
      align-content: ${this.alignContentOption};
    }
  };`



  elementosArray: Item[] = Array(1).fill(0).map(() => ({
    selected: false,
    id: 1,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    alignSelf: 'auto',
    order: 0,
  }));

  currentItem: Item = {
    selected: false,
    id: 0,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    alignSelf: 'auto',
    order: 0,
  };

  private subscriptions = new Subscription();

  ngOnInit() {

  }

  constructor() {
    this.subscriptions.add(
      this.numeroElementos.valueChanges.subscribe(value => {
        if (!value) { value = 0 };
        const currentLength = this.elementosArray.length;
        if (value > currentLength) {
          // Agregar nuevos elementos si value es mayor que la longitud actual
          for (let i = currentLength; i < value; i++) {
            this.elementosArray.push({
              selected: false,
              id: i + 1,
              flexGrow: 0,
              flexShrink: 1,
              flexBasis: 'auto',
              alignSelf: 'auto',
              order: 0,
            });
          }
        } else if (value < currentLength) {
          // Eliminar elementos si value es menor que la longitud actual
          this.elementosArray.splice(value, currentLength - value);
        }
      })
    );

    this.subscriptions.add(
      this.flexGrowOption.valueChanges.subscribe(value => {
        if (!value) { value = 0 };
        this.currentItem.flexGrow = value;
        this.elementosArray.forEach(element => {
          if (element.id == this.currentItem?.id) {
            element = this.currentItem;
          }
        })
      })
    );

    this.subscriptions.add(
      this.flexShrinkOption.valueChanges.subscribe(value => {
        if (!value) { value = 0 };
        this.currentItem.flexShrink = value;
        this.elementosArray.forEach(element => {
          if (element.id == this.currentItem.id) {
            element = this.currentItem;
          }
        })
      })
    );

    this.subscriptions.add()
    this.flexBasisOption.valueChanges.subscribe(value => {
      if (!value) { value = 'auto' };
      this.currentItem.flexBasis = value;
      this.elementosArray.forEach(element => {
        if (element.id == this.currentItem.id) {
          element = this.currentItem;
        }
      })
    })

    this.subscriptions.add(
      this.orderOption.valueChanges.subscribe(value => {
        if (!value) { value = 0 };
        this.currentItem.order = value;
        this.elementosArray.forEach(element => {
          if (element.id == this.currentItem.id) {
            element = this.currentItem;
          }
        })
      })
    )

  }

  itemSelected(item: Item) {
    this.currentItem = item;
    this.flexGrowOption.setValue(item.flexGrow);
    this.flexShrinkOption.setValue(item.flexShrink);
    this.flexBasisOption.setValue(item.flexBasis);
    this.alignSelfOption = item.alignSelf;
    this.orderOption.setValue(item.order);

    this.elementosArray.forEach(elemento => {
      elemento.selected = false;
    });
    this.currentItem.selected = true;
  };

  onOptionChange(newValue: string, optionName: string): void {
    console.log(`${optionName} changed to: ${newValue}`);
  };

  alignSelfChange(newValue: string) {
    this.currentItem.alignSelf = newValue;
    this.elementosArray.forEach(element => {
      if (element.id == this.currentItem.id) {
        element.alignSelf = this.currentItem.alignSelf;
      }
    })
  };

  getEstilos(elemento: any) {
    if (this.flexDirectionOption == 'row' || this.flexDirectionOption == 'row-reverse') {
      console.log('hey', this.widthElementos)
      return {
        'flex-grow': elemento.flexGrow,
        'flex-shrink': elemento.flexShrink,
        'flex-basis': elemento.flexBasis,
        'align-self': elemento.alignSelf,
        'order': elemento.order,
        'width.px': this.widthElementos.value
      };
    }
    else {
      return {
        'flex-grow': elemento.flexGrow,
        'flex-shrink': elemento.flexShrink,
        'flex-basis': elemento.flexBasis,
        'align-self': elemento.alignSelf,
        'order': elemento.order,
        'height.px': this.widthElementos.value
      };
    }
  };

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  };
}
