export interface PedidoDataResponse {
  idPedido: number;
  estado: string;
  fechaEntregaEstimada: string;
  subtotal: number;
  costoEnvio: number;
  total: number;
}