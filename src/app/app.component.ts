import {  OnInit, Component } from '@angular/core';
import {
  AppSettings
} from './class/app-settings';
declare let cordova: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {


  constructor() { }


  ngOnInit() {

  //  AppSettings.FS_SAVE = cordova.file.externalRootDirectory + "/Download";
  }

}
