import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-compras-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compras-list.html',
  styleUrl: './compras-list.css'
})
export class ComprasListComponent {

}
// En compras-list.component.ts
/*ordenarPor(campo: string) {
  this.compras.sort((a, b) => {
    if (a[campo] < b[campo]) return -1;
    if (a[campo] > b[campo]) return 1;
    return 0;
  });
}*/