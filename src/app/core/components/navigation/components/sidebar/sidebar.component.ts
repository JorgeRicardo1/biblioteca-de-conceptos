import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { LayoutComponent } from "../layout/layout.component";
import { Router } from '@angular/router';
import { MenuEntriesService } from '../../services/menu-entries.service';
import { CommonModule } from '@angular/common';
import { MenuEntry } from '../../interfaces/menu-entry.interface';
import { Subscription } from 'rxjs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';



@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    imports: [MatSidenavModule, LayoutComponent, CommonModule,MatTooltipModule,MatIconModule]
})
export class SidebarComponent {

  menuEntries: MenuEntry[] = [];
  isMenuOpen = true;
  private subscription = new Subscription();
  contentMargin = 275;

  constructor(
    private router: Router,
    private menuService: MenuEntriesService,
  ){
  }

  ngOnInit(): void {
    this.subscription.add(
      this.menuService.getMenu().subscribe((menu) => {
        this.menuEntries = menu;
      }),
    );
  }

  onToolbarMenuToggle() {
    this.isMenuOpen = !this.isMenuOpen;
    this.contentMargin = this.isMenuOpen ? 275 : 83;
  }

  navigateRoute(route: string | undefined) {
    if (route) {
      this.router.navigate([route]);
    } else {
      // Manejar el caso cuando la ruta sea undefined
    }
  }
}
