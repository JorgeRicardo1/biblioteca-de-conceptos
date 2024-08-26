import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { FormControl, ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { Subscription } from 'rxjs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';



@Component({
  selector: 'app-flexbox',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule,FormsModule, MatSelectModule,MatRadioModule,
    MatInputModule, ReactiveFormsModule, MatCheckboxModule, MatExpansionModule],
  templateUrl: './flexbox.component.html',
  styleUrl: './flexbox.component.css'
})
export class FlexboxComponent {
  flexDirectionOption = 'row';
  justifyContentOption = 'flex-start';
  alignItemsOption = 'stretch';
  flexWrapOption = 'nowrap';
  alignContentOption = 'stretch';
  numeroElementos =  new FormControl(1);
  widthElementos = new FormControl(100);

  elementosArray = Array(this.numeroElementos.value).fill(0);

  private subscriptions = new Subscription();

  ngOnInit() {

  }

  constructor(){
    this.subscriptions.add(
      this.numeroElementos.valueChanges.subscribe(value => {
        this.elementosArray = Array(value).fill(0).map( (x, y) => y );
      })
    );

    this.subscriptions.add(
      this.widthElementos.valueChanges.subscribe(value => {
        console.log('value');
      })
    );
  }

  onOptionChange(newValue: string, optionName: string): void {
    console.log(`${optionName} changed to: ${newValue}`);
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
