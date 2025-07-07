import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  @Input() isSidebarHidden = false;
  @Output() closeSidebar = new EventEmitter<void>();
  isAutoMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleAutoMenu() {
    this.isAutoMenuOpen = !this.isAutoMenuOpen;
  }

  onCloseSidebar(): void {
    this.closeSidebar.emit();
  }

  logout() {
    this.authService.logout();
  }

  navigateToUsuarios() {
    this.router.navigate(['/dashboard/usuarios']);
  }
}
