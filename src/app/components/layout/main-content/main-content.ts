import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-content.html',
  styleUrl: './main-content.css'
})
export class MainContentComponent {

}