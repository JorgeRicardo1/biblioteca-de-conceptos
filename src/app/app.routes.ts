import { Routes } from '@angular/router';
import { SidebarComponent } from './core/components/navigation/components/sidebar/sidebar.component';


export const routes: Routes = [
  {
    path : '',
    component : SidebarComponent,
    children : [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'flexbox',
        loadComponent: () => import('./pages/flexbox/flexbox.component').then(m => m.FlexboxComponent)
      },
      {
        path: 'grid',
        loadComponent: () => import('./pages/grid/grid.component').then(m => m.GridComponent)
      }

    ]
  }
];
