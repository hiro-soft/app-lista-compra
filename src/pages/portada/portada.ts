import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, FabContainer } from 'ionic-angular';
import { Settings } from '../../providers';
import { ListaInterface } from '../../interfaces';
import { TranslateService } from '@ngx-translate/core';
import { IonicNativeReconocimientoVozProvider } from '../../providers';

/**
 * Generated class for the PortadaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-portada',
    templateUrl: 'portada.html',
})
export class PortadaPage {

    options: any;

    listas: Array<ListaInterface> = [];

    settingsReady = false;

    grabando: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public settings: Settings, public translateService: TranslateService, private alertCtrl: AlertController, private reconocimientoVoz: IonicNativeReconocimientoVozProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PortadaPage');
    }

    ionViewWillEnter() {


        this.settings.load().then(() => {
            this.settingsReady = true;
            this.options = this.settings.allSettings;
            this.listas = this.options.listas;
            console.log(this.options);
        });
    }

    pararReconocimiento(fab: FabContainer){
        this.reconocimientoVoz.pararReconocimiento();
        this.grabando = false;
        fab.close();
    }

    nuevaListaVoz(fab: FabContainer){
        this.grabando = true;
        this.reconocimientoVoz.iniciarReconocimiento().then((matches: Array<string>) => {
            this.grabando = false;
            fab.close();
            if(matches.length == 1){
                let lista: ListaInterface = {
                    nombre: matches[0],
                    id: this.makeid(),
                    productosComprados: [],
                    productosPendientes: []
                };
                this.listas.push(lista);
                this.settings.setValue('listas', this.listas);
                this.verLista(lista);
            }else if(matches.length > 1){
                let alert = this.alertCtrl.create();
                alert.setTitle('Escoja un nombre');
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
                        let lista: ListaInterface = {
                            nombre: data,
                            id: this.makeid(),
                            productosComprados: [],
                            productosPendientes: []
                        };
                        this.listas.push(lista);
                        this.settings.setValue('listas', this.listas);
                        this.verLista(lista);
                    }
                });

                alert.present();
            }
        }).catch((error)=> {
            this.grabando = false;
            fab.close();
            console.log(error);
        });
    }

    nuevaLista(fab: FabContainer){
        fab.close();
        let alert = this.alertCtrl.create({
            title: 'Nombre de la lista',
            inputs: [
                {
                    name: 'nombre',
                    placeholder: 'Nombre'
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Crear',
                    handler: data => {
                        let lista: ListaInterface = {
                            nombre: data.nombre,
                            id: this.makeid(),
                            productosComprados: [],
                            productosPendientes: []
                        };
                        this.listas.push(lista);
                        this.settings.setValue('listas', this.listas);
                        this.verLista(lista);
                    }
                }
            ]
        });
        alert.present();
    }

    verLista(lista){
        this.navCtrl.push('ListasFichaPage', {lista: lista});
    }

    eliminarLista(lista){
        this.listas.forEach((listaElemento, index)=>{
            if(lista.id == listaElemento.id){
                this.listas.splice(index, 1)
            }
        });
        this.settings.setValue('listas', this.listas);
    }

    makeid(length: number = 20) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

}
