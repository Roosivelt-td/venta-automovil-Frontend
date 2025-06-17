import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { HeaderComponent } from '../header/header';
import { MainContentComponent } from '../main-content/main-content';
import {AuthService} from '../../../services/auth';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent {
  isAuthenticated = false;

  constructor(private authService: AuthService) {
    // Usa el método isLoggedIn en lugar de isAuthenticated$
    this.isAuthenticated = this.authService.isLoggedIn();
  }
}
