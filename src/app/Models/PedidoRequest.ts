import { DetallePedidoRequest } from "./DetallePedidoRequest";

export interface PedidoRequest {
  idDistrito?: number;
  direccionEntrega: string;
  tipoEnvio: string; // 'DELIVERY' o 'RECOJO_TIENDA'
  detalles: DetallePedidoRequest[];
}