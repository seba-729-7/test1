import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from '../../servicios/alumno.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Inscripcion } from 'src/app/models/inscripcion';
import { InscripcionService } from 'src/app/inscripciones/servicios/inscripcion.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-vista-alumno',
  templateUrl: './vista-alumno.component.html',
  styleUrls: ['./vista-alumno.component.css']
})
export class VistaAlumnoComponent implements OnInit {
  alumno!: Alumno;
  inscripciones!: Inscripcion[];
  suscripcion: any;
  inscripcionesAlumnos$!: Observable<Inscripcion[]>;
  idAlumno!: number;

  constructor(private activatedRoute: ActivatedRoute,
    private alumnoService: AlumnoService,
    private router: Router,
    private inscripcionService : InscripcionService
    ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((parametros) => {
      this.alumno = {
        id: parseInt(parametros.get('id') || '0'),
        nombre: parametros.get('nombre') || '',
        apellido: parametros.get('apellido') || '',
        edad: parseInt(parametros.get('edad') || '0'),
        dni: parseInt(parametros.get('dni') || '0')
      };
      this.idAlumno = parseInt(parametros.get('id') || '0');
    });
     this.inscripcionesAlumnos$ = this.inscripcionService.obtenerInscripciones().pipe(
      map((inscripciones: Inscripcion[])=>inscripciones.filter((inscripcion: Inscripcion)=> inscripcion.alumno.id == this.idAlumno))
     );
     this.suscripcion = this.inscripcionesAlumnos$.subscribe(datos=>{
      this.inscripciones = datos;
     });
  }

  ngOnDestroy(){
    this.suscripcion.unsubscribe();
  }

  volverAtras(){
    this.router.navigate(['alumnos/listar']);
  }

}