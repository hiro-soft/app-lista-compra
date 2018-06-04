import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Settings } from '../../providers';
import { ListaInterface, ListaProductoInterface } from '../../interfaces';
import { IonicNativeReconocimientoVozProvider } from '../../providers';

/**
 * Generated class for the ListasFichaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-listas-ficha',
    templateUrl: 'listas-ficha.html',
})
export class ListasFichaPage {

    lista: ListaInterface = {};

    disponibilidadReconocimientoVoz: boolean = true;

    nombre: string = '';

    grabando: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public settings: Settings, private reconocimientoVoz: IonicNativeReconocimientoVozProvider, public alertCtrl: AlertController) {
        this.lista = this.navParams.get('lista') ? this.navParams.get('lista') : {};
        console.log(this.lista);
    }

    ionViewDidEnter(){
        this.reconocimientoVoz.comprobarDisponibilidad().then((disponibilidad)=>{
            this.disponibilidadReconocimientoVoz = disponibilidad;
        }).catch((error)=> {
            console.log(error);
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ListasFichaPage');
    }

    pararReconocimiento(){
        this.reconocimientoVoz.pararReconocimiento();
        this.grabando = false;
    }

    iniciarReconocimiento(){
        this.grabando = true;
        this.reconocimientoVoz.iniciarReconocimiento().then((matches: Array<string>) => {
            this.grabando = false;
            if(matches.length == 1){
                this.nombre = matches[0];
                this.anadirProducto();
            }else if(matches.length > 1){
                let alert = this.alertCtrl.create();
                alert.setTitle('Escoja un producto');
                matches.forEach((match, index)=>{
                    alert.addInput({
                        type: 'radio',
                        label: match,
                        value: match,
                        checked: index == 0 ? true: false
                    })
                })
                alert.addButton('Cancelar');
                alert.addButton({
                    text: 'Añadir',
                    handler: (data: any) => {
                        this.nombre = data;
                        this.anadirProducto();
                    }
                });

                alert.present();
            }
        }).catch((error)=> {
            this.grabando = false;
            console.log(error);
        });
    }

    anadirProducto(){
        if(this.nombre == '')
            return;
        let producto: ListaProductoInterface = {
            nombre: this.nombre,
            id: this.makeid()
        }
        if(typeof this.lista.productosPendientes == 'undefined')
            this.lista.productosPendientes = [];
        this.lista.productosPendientes.unshift(producto);
        this._guardar();
        this.nombre = '';
    }

    eliminarProducto(producto){
        this.lista.productosPendientes.forEach((productoLista, index) =>{
            if(productoLista.id == producto.id)
                this.lista.productosPendientes.splice(index, 1);
        })
        this._guardar();
    }

    eliminarProductoComprado(producto){
        this.lista.productosComprados.forEach((productoLista, index) =>{
            if(productoLista.id == producto.id)
                this.lista.productosComprados.splice(index, 1);
        })
        this._guardar();
    }

    comprarProducto(producto){
        if(typeof this.lista.productosComprados == 'undefined')
            this.lista.productosComprados = [];
        this.lista.productosComprados.unshift(producto);
        this.eliminarProducto(producto);
    }

    pasarALaLista(producto){
        this.lista.productosComprados.forEach((productoLista, index) =>{
            if(productoLista.id == producto.id)
                this.lista.productosComprados.splice(index, 1);
        })
        this.lista.productosPendientes.unshift(producto);
        this._guardar();
    }

    private _guardar(){
        this.settings.load().then(() => {
            let listas: Array<ListaInterface> = this.settings.allSettings.listas;
            listas.forEach((lista, index)=>{
                if(lista.id == this.lista.id){
                    listas[index].productosPendientes = this.lista.productosPendientes;
                    listas[index].productosComprados = this.lista.productosComprados;
                }
            });
            this.settings.setValue('listas', listas);
        });
    }

    makeid(length: number = 20) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

}
