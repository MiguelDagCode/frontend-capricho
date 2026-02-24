import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface ItemPedido {
  nombre: string;
  cantidad: number;
  especificacion?: string;
}

export type EstadoPedido = 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO';
export type TipoEntrega  = 'EN_TIENDA' | 'DELIVERY';

export interface OrdenProduccion {
  id: number;
  numeroPedido: string;
  nombreCliente: string;           
  tipoEntrega: TipoEntrega;        
  horaEntregaPrometida?: string;   
  estado: EstadoPedido;
  items: ItemPedido[];             
  timestampLlegada: Date;          
  minutosEspera: number;           
  progreso: number;                
}

export interface CausaMerma {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-menu-pastelero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-pastelero.component.html',
  styleUrls: ['./menu-pastelero.component.css']
})
export class MenuPasteleroComponent implements OnInit, OnDestroy {
  /*Reloj*/
  horaActual: string = '';
  private relojInterval: any;
  private timerInterval: any;

  /*Tabs*/
  tabs = [
    { label: 'Todos',           value: 'TODOS' },
    { label: 'Pendientes',      value: 'PENDIENTE' },
    { label: 'En Preparación',  value: 'EN_PREPARACION' },
    { label: 'Listos',          value: 'LISTO' },
  ];
  tabActivo: string = 'TODOS';

  /*ordenes de producción (datos mock — reemplazar con HTTP)*/
  ordenes: OrdenProduccion[] = [
    {
      id: 1,
      numeroPedido: '042',
      nombreCliente: 'María García',
      tipoEntrega: 'EN_TIENDA',
      horaEntregaPrometida: '14:30',
      estado: 'PENDIENTE',
      timestampLlegada: new Date(Date.now() - 4 * 60000),
      minutosEspera: 4,
      progreso: 0,
      items: [
        { nombre: 'Torta de Chocolate Premium', cantidad: 1 },
        { nombre: 'Cupcakes de Vainilla', cantidad: 6, especificacion: 'Sin fresas' },
      ]
    },
    {
      id: 2,
      numeroPedido: '041',
      nombreCliente: 'Carlos Ríos',
      tipoEntrega: 'DELIVERY',
      horaEntregaPrometida: '15:00',
      estado: 'EN_PREPARACION',
      timestampLlegada: new Date(Date.now() - 22 * 60000),
      minutosEspera: 22,
      progreso: 65,
      items: [
        { nombre: 'Torta Red Velvet', cantidad: 1, especificacion: 'Más chocolate' },
      ]
    },
    {
      id: 3,
      numeroPedido: '040',
      nombreCliente: 'Sofía Mendoza',
      tipoEntrega: 'DELIVERY',
      horaEntregaPrometida: '13:45',
      estado: 'EN_PREPARACION',
      timestampLlegada: new Date(Date.now() - 10 * 60000),
      minutosEspera: 10,
      progreso: 30,
      items: [
        { nombre: 'Cheesecake de Frutos Rojos', cantidad: 2 },
        { nombre: 'Tres Leches Especial', cantidad: 1 },
      ]
    },
    {
      id: 4,
      numeroPedido: '039',
      nombreCliente: 'Pedro Villanueva',
      tipoEntrega: 'EN_TIENDA',
      estado: 'LISTO',
      timestampLlegada: new Date(Date.now() - 28 * 60000),
      minutosEspera: 28,
      progreso: 100,
      items: [
        { nombre: 'Combo Dulce Celebración', cantidad: 1 },
      ]
    },
    {
      id: 5,
      numeroPedido: '043',
      nombreCliente: 'Lucía Paredes',
      tipoEntrega: 'EN_TIENDA',
      horaEntregaPrometida: '16:00',
      estado: 'PENDIENTE',
      timestampLlegada: new Date(Date.now() - 2 * 60000),
      minutosEspera: 2,
      progreso: 0,
      items: [
        { nombre: 'Cupcakes de Vainilla', cantidad: 12 },
      ]
    },
  ];

  /*Modal Merma*/
  mostrarModalMerma: boolean = false;
  pedidoSeleccionado: OrdenProduccion | null = null;
  itemMermaSeleccionado: ItemPedido | null = null;
  causaSeleccionada: string = '';

  /*Causas predefinidas según RF-14*/
  causasMerma: CausaMerma[] = [
    { value: 'QUEMADO', label: 'Quemado',  icon: '🔥' },
    { value: 'CAIDA',   label: 'Caída',    icon: '💥' },
    { value: 'VENCIDO', label: 'Vencido',  icon: '🗑️' },
  ];

  constructor(private router: Router) {}

  /*lifecicle*/
  ngOnInit(): void {
    this.actualizarReloj();
    this.relojInterval = setInterval(() => this.actualizarReloj(), 1000);
    this.timerInterval = setInterval(() => this.recalcularTimers(), 60000);
  }

  ngOnDestroy(): void {
    clearInterval(this.relojInterval);
    clearInterval(this.timerInterval);
  }

  /*helpers*/
  actualizarReloj(): void {
    const now = new Date();
    this.horaActual = now.toLocaleTimeString('es-PE', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
  }

  recalcularTimers(): void {
    const now = Date.now();
    this.ordenes = this.ordenes.map(o => ({
      ...o,
      minutosEspera: Math.floor((now - o.timestampLlegada.getTime()) / 60000)
    }));
  }

  trackById(index: number, orden: OrdenProduccion): number {
    return orden.id;
  }

  /*Conteos para el header de stats*/
  get pedidosPendientes():    number { return this.ordenes.filter(o => o.estado === 'PENDIENTE').length; }
  get pedidosEnPreparacion(): number { return this.ordenes.filter(o => o.estado === 'EN_PREPARACION').length; }
  get pedidosListos():        number { return this.ordenes.filter(o => o.estado === 'LISTO').length; }

  contarPorEstado(tab: string): number {
    if (tab === 'TODOS') return this.ordenes.length;
    return this.ordenes.filter(o => o.estado === tab).length;
  }

  /*FIFO: más antiguo primero (RF-04)*/
  get pedidosFiltrados(): OrdenProduccion[] {
    const lista = this.tabActivo === 'TODOS'
      ? [...this.ordenes]
      : this.ordenes.filter(o => o.estado === this.tabActivo);

    return lista.sort((a, b) => a.timestampLlegada.getTime() - b.timestampLlegada.getTime());
  }

  cambiarTab(tab: string): void {
    this.tabActivo = tab;
  }

  getBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      'PENDIENTE':      'kds-badge--pendiente',
      'EN_PREPARACION': 'kds-badge--preparacion',
      'LISTO':          'kds-badge--listo',
    };
    return map[estado] || '';
  }

  getEstadoLabel(estado: string): string {
    const map: Record<string, string> = {
      'PENDIENTE':      'Pendiente',
      'EN_PREPARACION': 'En Preparación',
      'LISTO':          'Listo',
    };
    return map[estado] || estado;
  }

  /*Acciones en produccion*/
  /*RF-07 / RF-08 / RF-09 */
  iniciarPreparacion(orden: OrdenProduccion): void {
    orden.estado = 'EN_PREPARACION';
    orden.progreso = 5;
    console.log(`[RF-08] Orden #${orden.numeroPedido} → EN_PREPARACION`);
  }

  /*RF-10 / RF-11 / RF-12 */
  despacharPedido(orden: OrdenProduccion): void {
    orden.estado = 'LISTO';
    orden.progreso = 100;
     // aqui va el RF-11
    console.log(`[RF-10] Orden #${orden.numeroPedido} → LISTO. Notificando a mostrador/repartidor.`);

    // RF-12: Eliminar de pantalla tras 4 segundos
    setTimeout(() => {
      this.ordenes = this.ordenes.filter(o => o.id !== orden.id);
    }, 4000);
  }

  /*merma (RF-13 a RF-17)*/
  /*RF-13 */
  abrirModalMerma(orden: OrdenProduccion): void {
    this.pedidoSeleccionado = orden;
    this.itemMermaSeleccionado = null;
    this.causaSeleccionada = '';
    this.mostrarModalMerma = true;
  }

  cerrarModalMerma(): void {
    this.mostrarModalMerma = false;
    this.pedidoSeleccionado = null;
  }

  seleccionarItemMerma(item: ItemPedido): void {
    this.itemMermaSeleccionado = item;
  }

  /*RF-14 */
  seleccionarCausa(causa: string): void {
    this.causaSeleccionada = causa;
  }

  /*RF-15 / RF-16 / RF-17 */
  confirmarMerma(): void {
    if (!this.pedidoSeleccionado || !this.itemMermaSeleccionado || !this.causaSeleccionada) return;

    const payload = {
      pedidoId:   this.pedidoSeleccionado.id,
      item:       this.itemMermaSeleccionado.nombre,
      causa:      this.causaSeleccionada,
    };

    console.log('[RF-15] Registrando merma y descontando stock:', payload);

    // RF-17: Reiniciar a PENDIENTE y resetear cronómetro
    this.pedidoSeleccionado.estado = 'PENDIENTE';
    this.pedidoSeleccionado.progreso = 0;
    this.pedidoSeleccionado.timestampLlegada = new Date();
    this.pedidoSeleccionado.minutosEspera = 0;

    console.log(`[RF-17] Orden #${this.pedidoSeleccionado.numeroPedido} → PENDIENTE (SLA reiniciado).`);
    this.cerrarModalMerma();
  }
}