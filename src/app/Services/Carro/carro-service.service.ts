import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface CartItem {
  productoId: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  cantidad: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root',
})
export class CarroService {
  // Nuestro estado global del carrito (inicia vacío)
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor() { }

  // 1. Agregar al carrito
  agregar(producto: any, cantidad: number): void {
    const itemsActuales = this.cartSubject.getValue();
    
    // Verificamos si ya existe el producto en el carrito
    const itemExistente = itemsActuales.find(item => item.productoId === producto.id);

    if (itemExistente) {
      // Si existe, solo sumamos la cantidad
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio;
    } else {
      // Si no existe, lo agregamos como nuevo
      itemsActuales.push({
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagenUrl: producto.imagenUrl,
        cantidad: cantidad,
        subtotal: producto.precio * cantidad
      });
    }

    // Emitimos la nueva lista a todos los que estén escuchando
    this.cartSubject.next([...itemsActuales]);
  }

  // 2. Obtener el total de items (para la burbuja roja del Header)
  getTotalItems(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((total, item) => total + item.cantidad, 0))
    );
  }

  // 3. Obtener el precio total (para la vista del carrito)
  getTotalPrice(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((total, item) => total + item.subtotal, 0))
    );
  }
  cambiarCantidad(productoId: number, cambio: number): void {
    const items = this.cartSubject.getValue();
    const item = items.find(i => i.productoId === productoId);
    
    if (item) {
      item.cantidad += cambio;
      
      // Si la cantidad llega a 0, lo eliminamos del carrito
      if (item.cantidad <= 0) {
        this.eliminarProducto(productoId);
        return;
      }
      
      // Recalculamos el subtotal
      item.subtotal = item.cantidad * item.precio;
      this.cartSubject.next([...items]);
    }
  }

  // Eliminar producto usando el tachito de basura
  eliminarProducto(productoId: number): void {
    const itemsFiltrados = this.cartSubject.getValue().filter(item => item.productoId !== productoId);
    this.cartSubject.next(itemsFiltrados);
  }
}
