import { Injectable, signal, WritableSignal } from '@angular/core';
import { Container } from "../interfaces/container-flex";
import { Item } from "../interfaces/item-flex";

@Injectable({
  providedIn: 'root'
})
export class StylesServicesService {

  constructor() { }

  #containerStyles : WritableSignal<Container> = signal<Container>({
    flexDirection: '',
    justifyContent: '',
    alignItems: '',
    flexWrap: '',
    alignContent: ''
  })

  updateStyle(){

  }
}
