import { Injectable } from '@angular/core';
import { MenuEntry } from '../interfaces/menu-entry.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuEntriesService {

  constructor() { }

  private menu: MenuEntry[] = [
    { text: 'flexbox', route: 'flexbox', icon: 'people'},
    { text: 'grid', route: 'grid', icon: 'speed'},

  ]

  // Método que retorna el menú hardcodeado
  getMenu(): Observable<MenuEntry[]> {
    return of(this.menu);
  }
}
