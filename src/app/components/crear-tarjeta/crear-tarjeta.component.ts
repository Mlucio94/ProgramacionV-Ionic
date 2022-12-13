import { Component, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TarjetaService } from 'src/app/services/tarjeta.service';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { ToastrService } from 'ngx-toastr';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css']
})

export class CrearTarjetaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  titulo = 'Agregar Tarjeta';
  id: string|undefined;


  constructor(private fb: FormBuilder, private _tarjetaService: TarjetaService,
              private toastr: ToastrService,private toastController: ToastController) {
    this.form = this.fb.group({
      titular: ['',[Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      numeroTarjeta: ['',[Validators.required,Validators.pattern(/^[0-9]+$/) ,Validators.minLength(16),Validators.maxLength(16)]],
      fechaExpiracion: ['',[Validators.required,Validators.pattern(/^((0[1-9])|(1[0-2]))\/\d{2}$/), Validators.minLength(5),Validators.maxLength(5)]],
      cvv: ['',[Validators.required,Validators.pattern(/^[0-9]+$/) ,Validators.minLength(3),Validators.maxLength(3)]],
    })
  }

  ngOnInit(): void {
    this._tarjetaService.getTarjetaEdit().subscribe(data =>{
      this.id = data.id;
      this.titulo='Editar Tarjeta';
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion
      })
    })
  }

  guardarTarjeta(){
    if (!this.form.invalid){
      
      if(this.id === undefined){
        console.log(this.form.controls['fechaExpiracion'].value)
        if(this.validarFecha(this.form.controls['fechaExpiracion'].value)){
          this.agregarTarjeta();
        }else{
          //this.toastr.error('La Tarjeta que intenta ingresar se encuentra expirada','Error');
          this.presentToast('La Tarjeta que intenta ingresar se encuentra expirada','top')
        }
        
      }else{
        this.editarTarjeta(this.id);
      }
    }else{
      this.msgForm()
    } 
  }

  async presentToast(message:string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position
    });

    await toast.present();
  }

  validarFecha(fechaexp:string){
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const anio = parseInt(fecha.getFullYear().toString().slice(-2))
    const mm = parseInt(fechaexp.substring(0,2))
    const yy = parseInt(fechaexp.substring(3,5))

    if(yy >= anio){
      if (yy == anio){
        if(mm>=mes){
          return true
        }else{return false}
      }else{
        return true
      }
    }else{
      return false
    }
  }


  msgForm(){
    if(this.form.controls['cvv'].status == 'INVALID'){
      //this.toastr.error('Ingrese el cvv que se encuentra al dorso de su tarjeta','Error');
      this.presentToast('Ingrese el cvv que se encuentra al dorso de su tarjeta','top');
    }
    if(this.form.controls['fechaExpiracion'].status == 'INVALID'){
      //this.toastr.error('Ingrese una fecha de expiracion valida','Error');
      this.presentToast('Ingrese una fecha de expiracion valida','top');
    }
    if(this.form.controls['numeroTarjeta'].status == 'INVALID'){
      //this.toastr.error('Ingrerse un numero de Tarjeta válido, debe contener 16 digitos','Error');
      this.presentToast('Ingrerse un numero de Tarjeta válido, debe contener 16 digitos','top');
    }
    if(this.form.controls['titular'].status == 'INVALID'){
      //this.toastr.error('Ingrese el nombre del Titular','Error');
      this.presentToast('Ingrese el nombre del Titular','top');
    }
  }

  

  agregarTarjeta(){
    const TARJETA: any ={
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaCreacion:new Date(),
      fechaActualizacion:new Date(),
    }

    this.loading = true
    
    this._tarjetaService.guardarTarjeta(TARJETA).then(()=>{
      this.loading = false
      console.log('tarjeta Registrada');
     // this.toastr.success('Tarjeta registrada con exito', 'Tarjeta Registrada');
      this.presentToast('Tarjeta registrada con exito','top');
      this.form.reset()
    }, error => {
      //this.toastr.error('Opps... ocurrio un error','Error');
      this.presentToast('Opps... ocurrio un error','top');
      this.loading = false
      console.log(error);
    })
  }

  editarTarjeta(id:string){
    const TARJETA: any ={
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaActualizacion:new Date(),
    }

    this.loading = true
    
    this._tarjetaService.editarTarjeta(id,TARJETA).then(()=>{
      this.loading = false
      this.titulo = 'Agregar Tarjeta'
      this.form.reset()
      this.id = undefined
      //this.toastr.info('Tarjeta actualizada con exito', 'Registro Actualizado');
      this.presentToast('Tarjeta actualizada con exito','top');
      
    }, error => {
      //this.toastr.error('Opps... ocurrio un error','Error');
      this.presentToast('Opps... ocurrio un error','top');
      this.loading = false
      console.log(error);
    })
  }
}
