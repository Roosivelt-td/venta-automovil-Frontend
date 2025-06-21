import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { HeaderComponent } from '../header/header';
import {AuthService} from '../../../services/auth';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent {
  isAuthenticated = false;
  isSidebarHidden = false;

  constructor(private authService: AuthService) {
    // Usa el método isLoggedIn en lugar de isAuthenticated$
    this.isAuthenticated = this.authService.isLoggedIn();
  }

  ngOnInit() {
    // Ocultar sidebar por defecto en móvil
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize() {
    if (window.innerWidth < 768) {  // 768px es el breakpoint md de Tailwind
      this.isSidebarHidden = true;
    } else {
      this.isSidebarHidden = false;
    }
  }

  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

}
