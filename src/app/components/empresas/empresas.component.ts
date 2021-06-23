import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empresas } from '../../models/empresas';
import { EmpresasService } from '../../services/empresas.service';
import { ModalDialogService } from '../../services/modal-dialog.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})

export class EmpresasComponent implements OnInit {
  Titulo = 'Empresas';
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

  Items: Empresas[] = null;
  submitted: boolean = false;

  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private empresasService: EmpresasService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormRegistro = this.formBuilder.group({
      IdEmpresa: [null],
      RazonSocial: [
        null,
        [Validators.required, Validators.maxLength(50)]
      ],
      CantidadEmpleados: [null, [Validators.required, Validators.maxLength(7)]],
      FechaFundacion: [
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

  BuscarPorId(Dto, AccionABMC) {
    window.scroll(0, 0);

    this.empresasService.getById(Dto.IdEmpresa).subscribe((res: any) => {
      const itemCopy = { ...res };

      var arrFecha = itemCopy.FechaFundacion.substr(0, 10).split('-');
      itemCopy.FechaFundacion =
        arrFecha[2] + '/' + arrFecha[1] + '/' + arrFecha[0];

      this.FormRegistro.patchValue(itemCopy);
      this.AccionABMC = AccionABMC;
    });
  }


  Buscar(){
    this.empresasService.get().subscribe((res: any) => {
      this.Items = res;
    });
  }

  Agregar(){
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ Activo: true, IdEmpresa: 0 });
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
  }

  Consultar(Dto) {
    this.BuscarPorId(Dto, 'C');
  }

  Modificar (Dto) {
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
    this.BuscarPorId(Dto, 'M');
  }

  Eliminar (Dto) {
    this.modalDialogService.Confirm(
      'Esta seguro de eliminar este registro?',
      undefined,
      'SI',
      'NO',
      () =>
        this.empresasService
          .delete(Dto.IdEmpresa)
          .subscribe((res: any) => this.Buscar()
          ))
  }

  Grabar() {
    this.submitted = true;
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    var arrFecha = itemCopy.FechaFundacion.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.FechaAlta = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (this.AccionABMC == 'A') {

      this.empresasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();

      });
    } else {
      this.empresasService
        .put(itemCopy.IdArticulo, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          this.modalDialogService.Alert('Registro modificado correctamente.');
          this.Buscar();
          //this.modalDialogService.DesbloquearPantalla();
        });
    }
  }

  ImprimirListado() {
    this.modalDialogService.Alert('Sin desarrollar...');
  }



  Volver() {
    this.AccionABMC = 'L';
  }

}