import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Injectable } from '@angular/core';

/*
  Generated class for the IonicNativeReconocimientoVozProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IonicNativeReconocimientoVozProvider {

    constructor(private speechRecognition: SpeechRecognition) {
    }

    iniciarReconocimiento(){
        let promise = new Promise((resolve, reject) => {
            this.solicitarPermisos().then((response)=>{
            this.speechRecognition.stopListening();
            console.log(response)
            console.log('response')
                if(response == 'OK' || response == null){
                    this.speechRecognition.startListening({language: 'es'})
                        .subscribe(
                        (matches: Array<string>) => { resolve(matches) },
                        (onerror) => reject(onerror)
                    )
                     // capture speech for 5 seconds
                    setTimeout(() => {
                      this.speechRecognition.stopListening();
                    }, 4000);
                }
            })
        })
        return promise;
    }

    pararReconocimiento(){
        this.speechRecognition.stopListening();
    }

    comprobarDisponibilidad(): Promise<any>{
        return this.speechRecognition.isRecognitionAvailable();
    }

    solicitarPermisos(): Promise<any>{
        return this.speechRecognition.requestPermission();
    }

}
