import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListasFichaPage } from './listas-ficha';

@NgModule({
  declarations: [
    ListasFichaPage,
  ],
  imports: [
    IonicPageModule.forChild(ListasFichaPage),
  ],
})
export class ListasFichaPageModule {}
