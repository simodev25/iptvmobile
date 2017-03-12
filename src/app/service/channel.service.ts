import {
  Injectable
} from '@angular/core';
import {
  Subject,
  BehaviorSubject,
  Observable
} from 'rxjs/Rx';
import {
  Http,
  Response,
  Headers
} from '@angular/http';
import {
  ChannelResulta
} from '../class/channel-resulta';

import {
  AppSettings
} from '../class/app-settings';
import {
  SourceSetting, ISource
} from '../class/source-setting';

import { LocalStorageService } from 'angular-2-local-storage';

import * as cheerio from 'cheerio';
import {PingService} from './ping.service';

import { File } from 'ionic-native';

@Injectable()
export class ChannelService {

  channels: Observable<ChannelResulta[]>
  isCompleted: Observable<boolean>;
  private _channels: BehaviorSubject<ChannelResulta[]>;
  private _isCompleted: BehaviorSubject<boolean>;
  private baseUrl: string;
  private sources: Array<any>;
  private source: ISource;
  private _sizeList: any = 150;
  private autocChek: any = true;
  private dataStore: {
    channels: ChannelResulta[], channelsTemp: string[], channelsActive: ChannelResulta[]
  };
  constructor(public http: Http, private _pingService: PingService, private localStorageService: LocalStorageService) {
    var sourceSetting = new SourceSetting()
    this.sources = sourceSetting.getSource();

    this.dataStore = {
      channels: [],
      channelsTemp: [],
      channelsActive: []
    };

    this._channels = <BehaviorSubject<ChannelResulta[]>>new BehaviorSubject([]);
    this._isCompleted=new BehaviorSubject(false);
    this.channels = this._channels.asObservable();
    this.isCompleted=this._isCompleted.asObservable();
    if (this.localStorageService.get(AppSettings.SIZE_LIST) !== null) {
      this._sizeList = this.localStorageService.get(AppSettings.SIZE_LIST);
    }
    if (this.localStorageService.get(AppSettings.AUTO_SAVE) !== null) {
      this.autocChek = this.localStorageService.get(AppSettings.AUTO_SAVE);
    }

  }

  public findchannelListFrance() {
    var _source: any = this.sources[0];
    this.source = this.sources[0].source
    this.baseUrl = this.source.lien;
    var countLient = 0;
    var _maxSize = this._sizeList;
    var _autoChek = this.autocChek;

    let source = this.http.request(this.baseUrl)
      .concatMap(res => this.extractLiens(res))
      .concatMap(lien => this.extractChanneles(lien));

    let sourceCount = source.count();
    let index = 0;
    let subscription = source.subscribe(
      channel => {

        this.dataStore.channelsTemp = this.dataStore.channelsTemp.concat(channel);
      }, this.handleError, () => this.clearChanneles());

  }

  private httprequest(lien: string): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      this.http.request(lien).subscribe((data) => {


        resolve(data);

      },
        err => {
          console.log(err)

          reject();

        });
    });

  }

  public generateM3Ufile(): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
      let mp3File: string[] = [];

      var filename: string = 'ListTv.m3u';
      mp3File.push("#EXTM3U" + '\r\n')

      this.dataStore.channelsActive.forEach((channelResulta, index) => {
        mp3File.push("#EXTINF:-1," + channelResulta.channelName + '\r\n' + channelResulta.channelUrl + '\r\n')
      });

      let blob: Blob = new Blob([mp3File.join(' ')], { type: 'application/text' });

      File.writeFile(
        AppSettings.FS_SAVE,
        filename,
        blob,
        { replace: true }
      ).then(
        _ => { resolve(true) }
        ).catch(
        err => {
          console.log("file create failed:", err);
          resolve(false);
        }
        );

    });

  }

  private clearChanneles() {

    var source = Observable.from(this.dataStore.channelsTemp);
    if (this.autocChek) {
      var subscription = source.map(channel => this.formatChanneles(channel))
        .filter(channel => channel.channelUrl.indexOf("http://") != -1)

        .mergeMap(channelResulta => this._pingService.chekUrk(channelResulta.channelUrl),
        (channelResulta, chekUrk) => {
          channelResulta.channelActive = chekUrk;

          return channelResulta;
        })
        .filter(channelResulta => channelResulta.channelActive == true)
        .take(this._sizeList)
        .subscribe(
        channelResulta => {

          this.dataStore.channelsActive.push(channelResulta);
          this._channels.next(Object.assign({}, this.dataStore).channelsActive);
        },
        function(err) {
          console.log('Error: ' + err);
        },
        ()=> {
          this._isCompleted.next(true);
          console.log('Completed');
        });

    } else {
      var subscription = source.map(channel => this.formatChanneles(channel))
        .filter(channel => channel.channelUrl.indexOf("http://") != -1)
        .take(this._sizeList)
        .subscribe(
        channelResulta => {

          this.dataStore.channelsActive.push(channelResulta);
          this._channels.next(Object.assign({}, this.dataStore).channelsActive);
        },
        function(err) {
          console.log('Error: ' + err);
        },
        ()=> {
          this._isCompleted.next(true);
          console.log('Completed');
        });

    }




  }

  private formatChanneles(channel: string): ChannelResulta {
    var _low: number = 10;
    var _high: number = 1000;

    var nomchannel = channel.substring(0, channel.indexOf("http://"));

    var clearLien = channel.substring(channel.indexOf("http://"), channel.indexOf(".ts")) + ".ts";

    var id = Math.floor(Math.random() * (_high - _low + 1) + _low);

    return new ChannelResulta({
      id: id,
      channelName: nomchannel,
      channelUrl: clearLien
    });
  }
  private extractChanneles(lien: string): Promise<Array<string>> {
    return new Promise<Array<string>>((resolve, reject) => {
      this.http.request(lien).subscribe((res) => {


        resolve(this.source.extractChanneles(res));

      },
        err => {
          console.log(err)

          reject();

        });
    });

  }

  private extractLiens(res: Response) {
    let liens: Array<string> = this.source.extractLiens(res);
    return liens;
  }

  /**
   **/

  private extractChanneles_(res: Response) {
    return this.source.extractChanneles(res);
  }


  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }



}
