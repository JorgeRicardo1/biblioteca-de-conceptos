import { Injectable } from '@angular/core';
import { MenuEntry } from '../interfaces/menu-entry.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuEntriesService {

  constructor() { }

  private menu: MenuEntry[] = [
    { text: 'flexbox', route: 'chat', icon: 'people'},
    { text: 'grid', route: 'casos', icon: 'speed'},
    { text: 'busqueda', route: 'help', icon: 'query_stats' },
  ]

  // Método que retorna el menú hardcodeado
  getMenu(): Observable<MenuEntry[]> {
    return of(this.menu);
  }
}
