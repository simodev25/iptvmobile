import { Component, OnInit } from '@angular/core';
import {MdDialog} from '@angular/material';
import {ChannelService} from '../service/channel.service'
import {Subject, BehaviorSubject, Observable} from 'rxjs/Rx';
import {ChannelResulta} from '../class/channel-resulta';
import {StreamingMedia, StreamingVideoOptions} from 'ionic-native';
@Component({
  selector: 'save-dialog',
  template: `<p>m3uList is well saved </p>`
})

export class SaveDialog { }

@Component({
  selector: 'err-save-dialog',
  template: `<p>An error has occurred</p>`
})

export class ErrSaveDialog { }

@Component({
  selector: 'app-channe-list',
  templateUrl: './channe-list.component.html',
  styleUrls: ['./channe-list.component.css'],

})
export class ChanneListComponent implements OnInit {

  channelResultas: Observable<ChannelResulta[]>;
  isCompleted:Observable<boolean>;

  constructor(private channelService: ChannelService, public mdDialog: MdDialog) { }

  ngOnInit() {
    this.channelResultas = this.channelService.channels;
    this.isCompleted=this.channelService.isCompleted;
    this.channelService.findchannelListFrance();
  }
  playChannel(lien: string) {
    console.log(lien);
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: () => { console.log('Error streaming') },
      orientation: 'landscape'
    };

    StreamingMedia.playVideo(lien, options);

  }

  DownloadChannels() {


    this.channelService.generateM3Ufile().then(isOk => {
      if (isOk) {
        this.mdDialog.open(SaveDialog);
      } else {
        this.mdDialog.open(ErrSaveDialog);
      }
    }


    );

  }



}
