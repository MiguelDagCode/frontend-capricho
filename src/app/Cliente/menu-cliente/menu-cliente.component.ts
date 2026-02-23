import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-menu-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-cliente.component.html',
  styleUrls: ['./menu-cliente.component.css']
})
export class MenuClienteComponent {
  // Categoría seleccionada por defecto
  categoriaActiva: string = 'Todos';

  // Lista de categorías para los botones de filtro
  categorias: string[] = ['Todos', 'Tortas', 'Cupcakes', 'Postres', 'Combos'];

  // Datos Mock basados en las imágenes de referencia
  // NOTA PARA EL EQUIPO: Reemplazar estas URLs con las reales cuando el backend esté listo.
  productos: ProductoList[] = [
    {
      id: 1,
      nombre: 'Torta de Chocolate Premium',
      precio: 120.00,
      // Usamos un placeholder de torta de chocolate
      imagenUrl: 'https://placehold.co/400x300/5e3a27/ffffff?text=Torta+Chocolate',
      categoria: 'Tortas'
    },
    {
      id: 2,
      nombre: 'Torta Red Velvet',
      precio: 130.00,
      // Placeholder Red Velvet
      imagenUrl: 'https://placehold.co/400x300/d14d68/ffffff?text=Red+Velvet',
      categoria: 'Tortas'
    },
    {
      id: 3,
      nombre: 'Tres Leches Especial',
      precio: 95.00,
      // Placeholder Tres Leches
      imagenUrl: 'https://placehold.co/400x300/f5e1a4/5e3a27?text=Tres+Leches',
      categoria: 'Postres'
    },
    {
      id: 4,
      nombre: 'Cupcakes de Vainilla x6',
      precio: 45.00,
      // Placeholder Cupcakes
      imagenUrl: 'https://placehold.co/400x300/ffbad2/ffffff?text=Cupcakes+Vainilla',
      categoria: 'Cupcakes'
    },
    {
      id: 5,
      nombre: 'Combo Dulce Celebración',
      precio: 165.00,
      // Placeholder Combo (Macarons y otros)
      imagenUrl: 'https://placehold.co/400x300/e0c097/5e3a27?text=Combo+Celebracion',
      categoria: 'Combos'
    },
     {
      id: 6,
      nombre: 'Cheesecake de Frutos Rojos',
      precio: 85.00,
      imagenUrl: 'https://placehold.co/400x300/a3182d/ffffff?text=Cheesecake',
      categoria: 'Postres'
    }
  ];

  // Método simple para filtrar productos (lógica de frontend por ahora)
  get productosFiltrados(): ProductoList[] {
    if (this.categoriaActiva === 'Todos') {
      return this.productos;
    }
    return this.productos.filter(p => p.categoria === this.categoriaActiva);
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaActiva = categoria;
  }
}
