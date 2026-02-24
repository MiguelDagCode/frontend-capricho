import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoRequest } from '../Models/PedidoRequest';
import { ApiResponse } from '../Models/ApiResponse';
import { PedidoDataResponse } from '../Models/PedidoDataResponse';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  // En Angular 14+ podemos usar inject() en lugar del constructor
  private http = inject(HttpClient);
  
  // Apuntamos al API Gateway
  private apiUrl = 'http://localhost:8080/api/pedidos';

  registrarPedido(pedido: PedidoRequest): Observable<ApiResponse<PedidoDataResponse>> {
    // El AuthInterceptor inyectará el token automáticamente aquí
    return this.http.post<ApiResponse<PedidoDataResponse>>(this.apiUrl, pedido);
  }
}