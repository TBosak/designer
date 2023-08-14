import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { IonicModule } from '@ionic/angular';
import { ClickStopPropagationDirective } from './directives/stop-propagation';


@NgModule({
  declarations: [
    AppComponent,
    ContextMenuComponent,
    ClickStopPropagationDirective
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
