import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import {ChannelService} from './service/channel.service'
import {PingService} from './service/ping.service';
import { ChanneListComponent,SaveDialog,ErrSaveDialog } from './channe-list/channe-list.component';
import { SettingsComponent } from './settings/settings.component';
import { LocalStorageModule } from 'angular-2-local-storage';


@NgModule({
  declarations: [
    AppComponent,
    ChanneListComponent,SaveDialog,ErrSaveDialog, SettingsComponent
  ],
  imports: [MaterialModule.forRoot(), LocalStorageModule.withConfig({
            prefix: 'ioTv-app',
            storageType: 'localStorage'
        }),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ChannelService,PingService],
  bootstrap: [AppComponent,SaveDialog, ErrSaveDialog]

})
export class AppModule { }
