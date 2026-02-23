import { Routes } from '@angular/router';
import { MenuClienteComponent } from './Cliente/menu-cliente/menu-cliente.component';
import { ProductoDetalleComponent } from './Cliente/producto-detalle/producto-detalle.component';
import { AuthComponent } from './Auth/Components/auth/auth.component';
import { CarroPedidoComponent } from './Cliente/carro-pedido/carro-pedido.component';
import { MenuPasteleroComponent } from './Pastelero/menu-pastelero/menu-pastelero.component';
import { roleGuard } from './Auth/Guards/role.guard';
import { MenuAdministradorComponent } from './Administrador/menu-administrador/menu-administrador.component';

export const routes: Routes = [
  // RUTAS PÚBLICAS
  { path: '', component: MenuClienteComponent },
  { path: 'menu-cliente', component: MenuClienteComponent },
  { path: 'producto/:id', component: ProductoDetalleComponent },
  { path: 'auth', component: AuthComponent }, 
  
  // RUTAS SOLO PARA CLIENTES
  { 
    path: 'carrito', 
    component: CarroPedidoComponent,
    canActivate: [roleGuard],
    data: { roles: ['CLIENTE'] } // Solo el cliente puede ver el carrito
  },

  // RUTA SOLO PARA ADMIN
  { 
    path: 'menu-admin', 
    component: MenuAdministradorComponent,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] } 
  },

  // RUTA SOLO PARA PASTELERO (Y el Admin si quieres que supervise)
  { 
    path: 'menu-pastelero', 
    component: MenuPasteleroComponent,
    canActivate: [roleGuard],
    data: { roles: ['PASTELERO', 'ADMIN'] } 
  },

  { path: '**', redirectTo: '' } 
];