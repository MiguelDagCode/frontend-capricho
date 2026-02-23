import { Routes } from '@angular/router';
import { MenuClienteComponent } from './Cliente/menu-cliente/menu-cliente.component';
import { ProductoDetalleComponent } from './Cliente/producto-detalle/producto-detalle.component';
import { AuthComponent } from './Auth/Components/auth/auth.component';
import { CarroPedidoComponent } from './Cliente/carro-pedido/carro-pedido.component';
import { AuthGuard } from './Auth/Guards/auth.guard';

export const routes: Routes = [
  // RUTAS PÚBLICAS (Cualquiera puede entrar)
  { path: '', component: MenuClienteComponent },
  { path: 'menu-cliente', component: MenuClienteComponent },
  { path: 'producto/:id', component: ProductoDetalleComponent },
  { path: 'auth', component: AuthComponent },
  
  // RUTAS PROTEGIDAS (Requieren Token)
   { 
    path: 'carrito', 
    component: CarroPedidoComponent, 
    canActivate: [AuthGuard] 
   },
   
  // Ruta comodín por si escriben mal la URL
  { path: '**', redirectTo: '' } 
];
