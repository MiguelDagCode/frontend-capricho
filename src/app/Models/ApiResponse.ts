export interface ApiResponse<T> {
  success: boolean;
  mensaje: string;
  fecha: string;
  data: T;
}