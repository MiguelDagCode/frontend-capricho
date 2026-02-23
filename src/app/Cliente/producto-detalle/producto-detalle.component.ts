import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

// Reutilizamos la interfaz y le añadimos descripción
interface ProductoFrontend {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  categoria: string;
  descripcion: string;
}

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
  
  // Variable que guardará el producto encontrado para mostrarlo en el HTML
  producto: ProductoFrontend | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Capturamos el ID que viene en la URL
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.productoId = parseInt(idStr, 10);
        this.cargarProductoMock(this.productoId);
      }
    });
  }

  // Buscamos el producto en nuestra lista temporal
  cargarProductoMock(id: number): void {
    const productosMock: ProductoFrontend[] = [
      {
        id: 1, nombre: 'Torta de Chocolate Premium', precio: 120.00, categoria: 'Tortas',
        imagenUrl: 'https://placehold.co/400x400/5e3a27/ffffff?text=Torta+Chocolate',
        descripcion: 'Deliciosa torta de chocolate con triple capa de bizcocho húmedo, rellena y cubierta con nuestro fudge artesanal de la casa.'
      },
      {
        id: 2, nombre: 'Torta Red Velvet', precio: 130.00, categoria: 'Tortas',
        imagenUrl: 'https://placehold.co/400x400/d14d68/ffffff?text=Red+Velvet',
        descripcion: 'Elegante torta red velvet con frosting de queso crema, decorada con fresas frescas y flores comestibles. Un clásico irresistible.'
      },
      {
        id: 3, nombre: 'Tres Leches Especial', precio: 95.00, categoria: 'Postres',
        imagenUrl: 'https://placehold.co/400x400/f5e1a4/5e3a27?text=Tres+Leches',
        descripcion: 'Clásico postre latino bañado en nuestra mezcla secreta de tres leches, coronado con merengue italiano y canela.'
      },
      {
        id: 4, nombre: 'Cupcakes de Vainilla x6', precio: 45.00, categoria: 'Cupcakes',
        imagenUrl: 'https://placehold.co/400x400/ffbad2/ffffff?text=Cupcakes+Vainilla',
        descripcion: 'Caja de 6 esponjosos cupcakes de vainilla con buttercream de colores pasteles. Ideales para compartir.'
      },
      {
        id: 5, nombre: 'Combo Dulce Celebración', precio: 165.00, categoria: 'Combos',
        imagenUrl: 'https://placehold.co/400x400/e0c097/5e3a27?text=Combo+Celebracion',
        descripcion: 'El combo perfecto: Torta mediana a elección, 6 cupcakes variados y caja de macarons surtidos.'
      },
      {
        id: 6, nombre: 'Cheesecake de Frutos Rojos', precio: 85.00, categoria: 'Postres',
        imagenUrl: 'https://placehold.co/400x400/a3182d/ffffff?text=Cheesecake',
        descripcion: 'Cremoso cheesecake estilo New York horneado sobre base de galleta, cubierto con mermelada casera de frutos rojos.'
      }
    ];

    // Asignamos el producto encontrado a nuestra variable
    this.producto = productosMock.find(p => p.id === id);
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
}