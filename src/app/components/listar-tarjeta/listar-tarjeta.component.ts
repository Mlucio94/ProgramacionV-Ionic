import { Component, OnInit } from '@angular/core';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';
import { ToastrService } from 'ngx-toastr';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-listar-tarjeta',
  templateUrl: './listar-tarjeta.component.html',
  styleUrls: ['./listar-tarjeta.component.scss'],
})
export class ListarTarjetaComponent implements OnInit {
  listTarjetas : TarjetaCredito[]=[];
  filterPost = []
  

  constructor(private _tarjetaService: TarjetaService,private toastr: ToastrService,private toastController: ToastController) {
     
  }

  ngOnInit(): void {
    this.obetenerTarjetas();
  }

  obetenerTarjetas(){
    this._tarjetaService.obtenerTarjetas().subscribe(doc => {
      this.listTarjetas = [];
      doc.forEach((element:any) => {
        this.listTarjetas.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })       
      })
    })
  }

  eliminarTarjeta(id:any){
    this._tarjetaService.eliminarTarjeta(id).then(()=>{
        //this.toastr.error('Tarjeta eliminada exitosamente', 'Registro eliminado')
        this.presentToast('Tarjeta eliminada exitosamente','top');
    }, error =>{
        //this.toastr.error('Opps... ocurrio un error', 'Error')
        this.presentToast('Opps... ocurrio un error','top');
      }) 
  }

  editarTarjeta(tarjeta: TarjetaCredito){
    this._tarjetaService.addTarjetaedit(tarjeta);
  }

  filtrarCliente(){}

  async presentToast(message:string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position
    });

    await toast.present();
  }

}
