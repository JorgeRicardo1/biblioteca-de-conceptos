import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutComponent } from "../layout/layout.component";
import { Router } from '@angular/router';
import { MenuEntriesService } from '../../services/menu-entries.service';
import { CommonModule } from '@angular/common';
import { MenuEntry } from '../../interfaces/menu-entry.interface';
import { Subscription } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MediaMatcher } from '@angular/cdk/layout';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  imports: [MatSidenavModule, LayoutComponent, CommonModule, MatTooltipModule, MatIconModule, MatToolbarModule, MatButtonModule]
})
export class SidebarComponent {

  menuEntries: MenuEntry[] = [];
  isMenuOpen = true;
  private subscription = new Subscription();
  contentMargin = 275;
  opened: boolean = true;
  title = 'Generador de css';

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private router: Router,
    private menuService: MenuEntriesService,
  ) {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.subscription.add(
      this.menuService.getMenu().subscribe((menu) => {
        this.menuEntries = menu;
      }),
    );
  }



  navigateRoute(route: string | undefined) {
    if (route) {
      this.title = route;
      if(route === 'home'){
        this.title = 'Generador de css';
      }
      if(route === 'flexbox'){
        this.title = 'Flexbox';
      }
      if(route === 'grid'){
        this.title = 'Grid';
      }
      this.router.navigate([route]);
    } else {
      // Manejar el caso cuando la ruta sea undefined
    }
  }

  ngOnDestroy(){
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
