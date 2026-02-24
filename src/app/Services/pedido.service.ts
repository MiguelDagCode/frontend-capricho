import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ===== INTERFACES =====
export interface PedidoRequest {
  tipoEnvio: string;
  detalles: {
    idProducto: number;
    cantidad: number;
  }[];
  idDistrito?: number;
  direccionEntrega?: string;
}

export interface PedidoResponse {
  idPedido: number;
  estado: string;
  fechaEntregaEstimada: string;
  subtotal: number;
  costoEnvio: number;
  total: number;
}

export interface PedidoCocina {
  idPedido: number;
  estado: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO';
  fechaRegistro: string;
  tiempoTranscurrido: string;
  nombreCliente?: string;
  tipoEntrega: 'DELIVERY' | 'RECOJO_TIENDA';
  horaEntregaPrometida?: string;
  minutosEspera: number;
  detalles: {
    idProducto: number;
    nombreProducto: string;
    cantidad: number;
    observaciones?: string;
    precioUnitario: number;
  }[];
  progreso?: number;
  numeroPedido?: string;
}

export interface MermaRequest {
  idProducto: number;
  idMotivo: number;
  observacion?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  mensaje: string;
  fecha: string;
  data: T;
}

export interface ApiResponseList<T> {
  success: boolean;
  mensaje: string;
  fecha: string;
  data: T[];
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  
  constructor(private http: HttpClient) {}
  
  private apiUrl = 'http://localhost:8080/api/pedidos';

  registrarPedido(pedido: PedidoRequest): Observable<ApiResponse<PedidoResponse>> {
    return this.http.post<ApiResponse<PedidoResponse>>(this.apiUrl, pedido);
  }

  obtenerColaProduccion(): Observable<ApiResponseList<PedidoCocina>> {
    return this.http.get<ApiResponseList<PedidoCocina>>(`${this.apiUrl}/cocina/cola`);
  }

  iniciarPreparacion(idPedido: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/cocina/${idPedido}/iniciar`, {});
  }

  marcarPedidoListo(idPedido: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/cocina/${idPedido}/listo`, {});
  }

  registrarMerma(idPedido: number, request: MermaRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/cocina/${idPedido}/merma`, request);
  }
}