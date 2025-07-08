import { Component, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  @Input() isSidebarOpen = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  isUserMenuOpen = false;
  window = window;

  constructor(private authService: AuthService) {}

  // Métodos para obtener datos del usuario
  getUserName(): string {
    return this.authService.getUserName();
  }

  getUserEmail(): string {
    return this.authService.getUserEmail();
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  // Cerrar menú de usuario al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const userMenuElement = (event.target as HTMLElement).closest('.user-menu');
    if (!userMenuElement) {
      this.isUserMenuOpen = false;
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.isUserMenuOpen = false;
  }
}
