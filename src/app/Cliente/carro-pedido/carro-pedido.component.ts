import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { Observable, take } from 'rxjs';
import Swal from 'sweetalert2'; // 👈 ¡La cereza del pastel!

import { CarroService, CartItem } from '../../Services/Carro/carro-service.service';
import { PedidoService } from '../../Services/pedido.service';
import { PedidoRequest } from '../../Models/PedidoRequest';
import { DetallePedidoRequest } from '../../Models/DetallePedidoRequest';

@Component({
  selector: 'app-carro-pedido',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './carro-pedido.component.html',
  styleUrl: './carro-pedido.component.css',
})
export class CarroPedidoComponent implements OnInit {
  
  cartItems$: Observable<CartItem[]>;
  totalPrice$: Observable<number>;
  totalItems$: Observable<number>;

  isProcesando: boolean = false;

  tipoEnvio: string = 'DELIVERY';
  idDistrito: number = 1;
  direccionEntrega: string = '';

  distritos = [
    { id: 1, nombre: 'Carabayllo' },
    { id: 2, nombre: 'Comas' },
    { id: 3, nombre: 'Los Olivos' },
    { id: 4, nombre: 'Independencia' },
    { id: 5, nombre: 'San Martín de Porres' }
  ];

  private pedidoService = inject(PedidoService);
  private router = inject(Router);

  constructor(public cartService: CarroService) {
    this.cartItems$ = this.cartService.cart$;
    this.totalPrice$ = this.cartService.getTotalPrice();
    this.totalItems$ = this.cartService.getTotalItems();
  }

  ngOnInit(): void {}

  aumentar(id: number) { this.cartService.cambiarCantidad(id, 1); }
  disminuir(id: number) { this.cartService.cambiarCantidad(id, -1); }
  
  eliminar(id: number) { 
    // Pequeño extra visual para la eliminación
    Swal.fire({
      title: '¿Quitar producto?',
      text: 'Se eliminará de tu carrito de compras.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d14d68',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.eliminarProducto(id);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        });
        Toast.fire({ icon: "success", title: "Producto eliminado" });
      }
    });
  }

  generarPedido() {
    // 1. Validación Visual Elegante (Dirección)
    if (this.tipoEnvio === 'DELIVERY' && this.direccionEntrega.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Por favor, ingresa una dirección de entrega válida.',
        confirmButtonColor: '#d14d68'
      });
      return;
    }

    this.cartItems$.pipe(take(1)).subscribe(items => {
      
      // 2. Validación Visual Elegante (Carrito Vacío)
      if (items.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Carrito vacío',
          text: 'Agrega unos deliciosos postres para comenzar.',
          confirmButtonColor: '#d14d68'
        });
        return;
      }

      this.isProcesando = true;

      // Pantalla de carga mientras responde el servidor
      Swal.fire({
        title: 'Procesando tu pedido...',
        text: 'Validando stock e inventario',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const detallesRequest: DetallePedidoRequest[] = items.map(item => ({
        idProducto: item.productoId,
        cantidad: item.cantidad
      }));

      const pedidoPayload: PedidoRequest = {
        idDistrito: this.tipoEnvio === 'DELIVERY' ? Number(this.idDistrito) : undefined, 
        direccionEntrega: this.tipoEnvio === 'DELIVERY' ? this.direccionEntrega : 'Recojo en Tienda Físico',
        tipoEnvio: this.tipoEnvio,
        detalles: detallesRequest
      };

      this.pedidoService.registrarPedido(pedidoPayload).subscribe({
        next: (response) => {
          this.isProcesando = false;
          
          // 3. ¡Éxito Triunfal!
          Swal.fire({
            icon: 'success',
            title: '¡Pedido Confirmado!',
            html: `
              <div class="text-start mt-3">
                <p><b>${response.mensaje}</b></p>
                <p>Tu N° de Pedido es: <span class="badge bg-dark fs-6">${response.data.idPedido}</span></p>
                <p class="fs-5 mt-3">Total a pagar: <b style="color: #d14d68;">S/ ${response.data.total.toFixed(2)}</b></p>
              </div>
            `,
            confirmButtonColor: '#d14d68',
            confirmButtonText: '¡Gracias!'
          }).then(() => {
            this.cartService.vaciarCarrito();
            this.router.navigate(['/']); 
          });
        },
        error: (err) => {
          this.isProcesando = false;
          console.error('Error del Backend:', err);
          
          // 4. Manejo de Errores Profesional
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un problema al registrar tu orden. Revisa si hay stock disponible o intenta nuevamente.',
            confirmButtonColor: '#d14d68'
          });
        }
      });
    });
  }
}