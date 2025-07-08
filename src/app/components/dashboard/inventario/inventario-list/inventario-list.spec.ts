import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioList } from './inventario-list';

describe('InventarioList', () => {
  let component: InventarioList;
  let fixture: ComponentFixture<InventarioList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
