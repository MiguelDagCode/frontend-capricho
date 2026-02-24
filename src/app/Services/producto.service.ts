import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';// Ajusta tu ruta
import { ProductoResponseDto } from '../Models/ProductoResponseDto';
import { ApiResponse } from '../Models/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // Apuntamos al Gateway (Puerto 8080)
  private apiUrl = 'http://localhost:8080/api/catalogo/productos';

  constructor(private http: HttpClient) { }

  listarProductos(): Observable<ProductoResponseDto[]> {
    return this.http.get<ApiResponse<ProductoResponseDto[]>>(this.apiUrl).pipe(
      // El map extrae solo el arreglo 'data' y descarta el success, mensaje, etc.
      map(response => response.data)
    );
  }
}