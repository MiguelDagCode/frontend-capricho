import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { PedidoService, PedidoCocina } from '../../Services/pedido.service';

@Component({
  selector: 'app-menu-pastelero',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './menu-pastelero.component.html',
  styleUrls: ['./menu-pastelero.component.css'],
})
export class MenuPasteleroComponent implements OnInit, OnDestroy {
  constructor(private pedidoService: PedidoService) {}

  pedidos: (PedidoCocina & { numeroPedido?: string })[] = [];
  pedidosFiltrados: (PedidoCocina & { numeroPedido?: string })[] = [];
  tabActivo: 'TODOS' | 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' = 'TODOS';

  pedidosPendientes = 0;
  pedidosEnPreparacion = 0;
  pedidosListos = 0;

  horaActual: string = '';
  private relojSubscription?: Subscription;
  private refreshSubscription?: Subscription;

  mostrarModalMerma = false;
  pedidoSeleccionado?: PedidoCocina & { numeroPedido?: string };
  itemMermaSeleccionado?: any;
  causaSeleccionada?: number;

  tabs: { label: string; value: 'TODOS' | 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' }[] = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Pendientes', value: 'PENDIENTE' },
    { label: 'En Preparación', value: 'EN_PREPARACION' },
    { label: 'Listos', value: 'LISTO' },
  ];

  causasMerma = [
    { id: 1, nombre: 'Quemado', icon: '🔥', value: 'quemado' },
    { id: 2, nombre: 'Caída', icon: '💔', value: 'caida' },
    { id: 3, nombre: 'Vencido', icon: '⏰', value: 'vencido' },
  ];

  ngOnInit(): void {
    this.cargarPedidos();
    this.iniciarReloj();
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.cargarPedidos();
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
    this.relojSubscription?.unsubscribe();
  }

  cargarPedidos(): void {
    this.pedidoService.obtenerColaProduccion().subscribe({
      next: (response) => {
        if (response.success) {
          this.pedidos = response.data.map((p) => ({
            ...p,
            numeroPedido: this.formatearNumeroPedido(p.idPedido),
            minutosEspera: this.calcularMinutosEspera(p.fechaRegistro),
            horaEntregaPrometida: this.formatearHoraEntrega(p.fechaRegistro),
            progreso: p.estado === 'EN_PREPARACION' ? this.calcularProgreso(p.fechaRegistro) : undefined,
            nombreCliente: p.nombreCliente || `Cliente ${p.idPedido}`,
          }));
          
          this.actualizarStats();
          this.filtrarPedidos();
        }
      },
      error: (error) => {
        console.error('Error cargando pedidos:', error);
      },
    });
  }

  formatearNumeroPedido(id: number): string {
    return `PED-${id.toString().padStart(4, '0')}`;
  }

  calcularMinutosEspera(fechaRegistro: string): number {
    const registro = new Date(fechaRegistro);
    const ahora = new Date();
    const diffMs = ahora.getTime() - registro.getTime();
    return Math.floor(diffMs / 60000);
  }

  calcularProgreso(fechaRegistro: string): number {
    const minutos = this.calcularMinutosEspera(fechaRegistro);
    return Math.min(100, (minutos / 20) * 100);
  }

  formatearHoraEntrega(fechaRegistro: string): string {
    const fecha = new Date(fechaRegistro);
    fecha.setHours(fecha.getHours() + 5);
    return fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }

  iniciarReloj(): void {
    this.relojSubscription = interval(1000).subscribe(() => {
      const ahora = new Date();
      this.horaActual = ahora.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      if (ahora.getSeconds() === 0) {
        this.actualizarMinutosEspera();
      }
    });
  }

  actualizarMinutosEspera(): void {
    this.pedidos.forEach((p) => {
      p.minutosEspera = this.calcularMinutosEspera(p.fechaRegistro);
    });
  }

  actualizarStats(): void {
    this.pedidosPendientes = this.pedidos.filter((p) => p.estado === 'PENDIENTE').length;
    this.pedidosEnPreparacion = this.pedidos.filter((p) => p.estado === 'EN_PREPARACION').length;
    this.pedidosListos = this.pedidos.filter((p) => p.estado === 'LISTO').length;
  }

  cambiarTab(tab: 'TODOS' | 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO'): void {
    this.tabActivo = tab;
    this.filtrarPedidos();
  }

  filtrarPedidos(): void {
    if (this.tabActivo === 'TODOS') {
      this.pedidosFiltrados = [...this.pedidos];
    } else {
      this.pedidosFiltrados = this.pedidos.filter((p) => p.estado === this.tabActivo);
    }
  }

  iniciarPreparacion(pedido: PedidoCocina & { numeroPedido?: string }): void {
    this.pedidoService.iniciarPreparacion(pedido.idPedido).subscribe({
      next: (response) => {
        if (response.success) {
          pedido.estado = 'EN_PREPARACION';
          pedido.progreso = 0;
          this.actualizarStats();
          this.filtrarPedidos();
        }
      },
      error: (error) => {
        console.error('Error al iniciar preparación:', error);
        alert('No se pudo iniciar la preparación');
      },
    });
  }

  marcarListo(pedido: PedidoCocina & { numeroPedido?: string }): void {
    this.pedidoService.marcarPedidoListo(pedido.idPedido).subscribe({
      next: (response) => {
        if (response.success) {
          pedido.estado = 'LISTO';
          this.actualizarStats();
          this.filtrarPedidos();
        }
      },
      error: (error) => {
        console.error('Error al marcar como listo:', error);
        alert('No se pudo marcar el pedido como listo');
      },
    });
  }

  abrirModalMerma(pedido: PedidoCocina & { numeroPedido?: string }): void {
    this.pedidoSeleccionado = pedido;
    this.itemMermaSeleccionado = null;
    this.causaSeleccionada = undefined;
    this.mostrarModalMerma = true;
  }

  cerrarModalMerma(): void {
    this.mostrarModalMerma = false;
    this.pedidoSeleccionado = undefined;
    this.itemMermaSeleccionado = null;
    this.causaSeleccionada = undefined;
  }

  seleccionarItemMerma(item: any): void {
    this.itemMermaSeleccionado = item;
  }

  seleccionarCausa(causaValue: string): void {
    const causa = this.causasMerma.find((c) => c.value === causaValue);
    this.causaSeleccionada = causa?.id;
  }

  confirmarMerma(): void {
    if (!this.pedidoSeleccionado || !this.itemMermaSeleccionado || !this.causaSeleccionada) {
      alert('Debe seleccionar un ítem y una causa');
      return;
    }

    const request = {
      idProducto: this.itemMermaSeleccionado.idProducto,
      idMotivo: this.causaSeleccionada,
      observacion: `${this.itemMermaSeleccionado.nombreProducto} - ${this.causasMerma.find((c) => c.id === this.causaSeleccionada)?.nombre}`,
    };

    this.pedidoService.registrarMerma(this.pedidoSeleccionado.idPedido, request).subscribe({
      next: (response) => {
        if (response.success) {
          this.cargarPedidos();
          this.cerrarModalMerma();
        }
      },
      error: (error) => {
        console.error('Error al registrar merma:', error);
        alert('Error al registrar merma. Intente nuevamente.');
      },
    });
  }

  getBadgeClass(estado: string): string {
    const clases: Record<string, string> = {
      PENDIENTE: 'kds-badge--pendiente',
      EN_PREPARACION: 'kds-badge--preparacion',
      LISTO: 'kds-badge--listo',
    };
    return clases[estado] || '';
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      EN_PREPARACION: 'En Prep.',
      LISTO: 'Listo',
    };
    return labels[estado] || estado;
  }

  trackById(index: number, item: PedidoCocina & { numeroPedido?: string }): number {
    return item.idPedido;
  }

  contarPorEstado(estado: 'TODOS' | 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO'): number {
    if (estado === 'TODOS') return this.pedidos.length;
    return this.pedidos.filter((p) => p.estado === estado).length;
  }
}