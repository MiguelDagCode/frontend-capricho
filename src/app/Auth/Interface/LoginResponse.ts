export interface LoginResponse {
  success: boolean;
  mensaje: string;
  fecha: string;
  data: {
    token: string;
  };
}