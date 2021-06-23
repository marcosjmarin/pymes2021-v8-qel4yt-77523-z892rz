import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ventas } from '../../models/ventas';
import { VentasService } from '../../services/ventas.service';
import { ModalDialogService } from '../../services/modal-dialog.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  Titulo = 'Ventas';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Items: Ventas[] = null;
  submitted: boolean = false;

  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private VentasService: VentasService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormRegistro = this.formBuilder.group({
      IdVenta: [null],
      ClienteNombre: [
        null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(55)]
      ],
      Total: [null, [Validators.required, Validators.pattern('^\\d{1,7}$')]],
      Fecha: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ]
    });
  }

  Buscar() {
    //this.modalDialogService.BloquearPantalla();
    this.VentasService.get().subscribe((res: any) => {
      this.Items = res.Items;
    });
  }

  Consultar(item) {}
}
