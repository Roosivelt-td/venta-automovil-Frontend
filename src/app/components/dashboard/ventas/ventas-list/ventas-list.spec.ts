import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasList } from './ventas-list';

describe('VentasList', () => {
  let component: VentasList;
  let fixture: ComponentFixture<VentasList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
