import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ProductoResponseDto } from '../../Models/ProductoResponseDto';
import { ProductoService } from '../../Services/producto.service';

@Component({
  selector: 'app-menu-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-cliente.component.html',
  styleUrls: ['./menu-cliente.component.css']
})
export class MenuClienteComponent implements OnInit {
  
  productos: ProductoResponseDto[] = [];
  categorias: string[] = ['Todos']; // Empezamos solo con 'Todos'
  categoriaActiva: string = 'Todos';

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    // Consumimos el servicio al cargar la página
    this.productoService.listarProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.extraerCategoriasDinamicas(data); // Generamos los botones
      },
      error: (err) => {
        console.error('Error al cargar el catálogo desde el backend', err);
      }
    });
  }

  // Truco: Extraemos las categorías únicas de la lista de productos
  private extraerCategoriasDinamicas(productos: ProductoResponseDto[]): void {
    const categoriasUnicas = new Set(productos.map(p => p.categoria));
    this.categorias = ['Todos', ...Array.from(categoriasUnicas)];
  }

  // Filtrado reactivo en memoria (súper rápido)
  get productosFiltrados(): ProductoResponseDto[] {
    if (this.categoriaActiva === 'Todos') {
      return this.productos;
    }
    return this.productos.filter(p => p.categoria === this.categoriaActiva);
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaActiva = categoria;
  }
  
  // Método auxiliar para hacer scroll suave a la sección de productos
  scrollToProductos(): void {
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
  }
}