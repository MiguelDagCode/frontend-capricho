import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuPasteleroComponent } from './menu-pastelero.component';


describe('MenuPasteleroComponent', () => {
  let component: MenuPasteleroComponent;
  let fixture: ComponentFixture<MenuPasteleroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPasteleroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPasteleroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
