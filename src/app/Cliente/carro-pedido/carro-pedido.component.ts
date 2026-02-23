import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";
import { Observable } from 'rxjs';
import { CarroService, CartItem } from '../../Services/Carro/carro-service.service';

@Component({
  selector: 'app-carro-pedido',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carro-pedido.component.html',
  styleUrl: './carro-pedido.component.css',
})
export class CarroPedidoComponent implements OnInit {
  
  cartItems$: Observable<CartItem[]>;
  totalPrice$: Observable<number>;
  totalItems$: Observable<number>;

  constructor(public cartService: CarroService) {
    // Conectamos las variables de la vista directo a la fuente de la verdad
    this.cartItems$ = this.cartService.cart$;
    this.totalPrice$ = this.cartService.getTotalPrice();
    this.totalItems$ = this.cartService.getTotalItems();
  }

  ngOnInit(): void {}

  aumentar(id: number) {
    this.cartService.cambiarCantidad(id, 1);
  }

  disminuir(id: number) {
    this.cartService.cambiarCantidad(id, -1);
  }

  eliminar(id: number) {
    this.cartService.eliminarProducto(id);
  }

  // Este será nuestro puente con ms-pedidos
  generarPedido() {
    alert('¡Procesando! Aquí conectaremos con el POST de ms-pedidos y OpenFeign.');
  }
}
