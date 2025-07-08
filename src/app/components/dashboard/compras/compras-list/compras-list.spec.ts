import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasListComponent } from './compras-list';

describe('ComprasList', () => {
  let component: ComprasListComponent;
  let fixture: ComponentFixture<ComprasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
