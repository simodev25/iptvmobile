import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import {
  AppSettings
} from '../class/app-settings';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public autoSave:any = true;
  public sizeList: any = 300;
  public color: any = "primary"
  constructor(private localStorageService: LocalStorageService) {


  }

  ngOnInit() {

    var _sizeList = this.localStorageService.get(AppSettings.SIZE_LIST);
    var _autoSave = this.localStorageService.get(AppSettings.AUTO_SAVE);
    if (_sizeList !== null) {
      this.sizeList = _sizeList;
    }
    if (_autoSave != null) {
      this.autoSave = _autoSave ;
    }
  }

  public saveChange(event: any) {
    this.localStorageService.set(AppSettings.AUTO_SAVE, this.autoSave);
    this.localStorageService.set(AppSettings.SIZE_LIST, this.sizeList);
    console.log(this.autoSave);
  }
}
