import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarroPedidoComponent } from './carro-pedido.component';


describe('CarroPedidoComponent', () => {
  let component: CarroPedidoComponent;
  let fixture: ComponentFixture<CarroPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarroPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarroPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
