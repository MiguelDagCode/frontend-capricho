import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CarroService } from '../../Services/Carro/carro-service.service';
import { ProductoResponseDto } from '../../Models/ProductoResponseDto';
import { ProductoService } from '../../Services/producto.service';



@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {
  
  productoId: number = 0;
  cantidad: number = 1;
  producto: ProductoResponseDto | undefined;
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, 
    private carroService: CarroService, 
    private productoService: ProductoService) {}

  ngOnInit(): void {
    // Capturamos el ID de la URL
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.productoId = parseInt(idStr, 10);
        this.cargarProductoReal(this.productoId);
      }
    });
  }

  cargarProductoReal(id: number): void {
    this.isLoading = true;
    
    // Llamamos al único endpoint que tenemos
    this.productoService.listarProductos().subscribe({
      next: (productos) => {
        // Magia de JavaScript: Buscamos el producto exacto en la lista
        this.producto = productos.find(p => p.id === id);
        this.isLoading = false;
        
        if (!this.producto) {
          console.warn(`Producto con ID ${id} no encontrado en el catálogo.`);
        }
      },
      error: (err) => {
        console.error('Error al cargar el producto', err);
        this.isLoading = false;
      }
    });
  }

  // Métodos para el selector de cantidad
  aumentarCantidad(): void {
    this.cantidad++;
  }

  disminuirCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }
agregarAlCarrito(): void {
    if (this.producto) {
      // Enviamos el producto y la cantidad seleccionada al servicio
      this.carroService.agregar(this.producto, this.cantidad);
      
      // Opcional: Redirigir directamente al carrito después de agregar
      // this.router.navigate(['/carrito']);
      
      // O solo mostrar una alerta para que sepa que se agregó
      alert(`¡Se agregaron ${this.cantidad} ${this.producto.nombre} al carrito!`);
    }
  }
}