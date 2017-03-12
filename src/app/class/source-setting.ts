import {
  Response
} from '@angular/http';
import * as cheerio from 'cheerio';

export interface ISource {
  key: string;
  lien: string;
  extractLiens(res: any): Array<string>;
  extractChanneles(res: any): string[];

}



export class SourceSetting {
  private sources: Array<any> = new Array<any>();
  constructor() {

    let source = {
      key: 'FR_iptvsatlinks',
      lien: 'http://iptvsatlinks.blogspot.co.uk/search/label/French',
      extractLiens: (res: Response) => {

        let liens: Array<string> = new Array();
        let body = cheerio.load(res.text());
        let elems: any;
        if (this.isMobile()) {
          elems = body('div[class=mobile-post-outer]');
        } else {
          elems = body('h3');
        }
        var lien: any;
        for (var i = 0; i < elems.length ; i++) {
          if (elems[i].children != null && elems[i].children[1] != null) {
            lien = elems[i].children[1].attribs;
            liens.push(lien.href);
          }

        }
        return liens;
      }
      ,
      extractChanneles: (res: Response) => {
        let body = cheerio.load(res.text());
        var dviLienTvs = body('div[class=code]');

        return dviLienTvs.text().trim().split(",");
      }
    }

    this.sources.push({ key: source.key, source: source });

  }


  public getSource(): ISource[] {

    return this.sources;
  }

  private isMobile(): boolean {
    var ua = window.navigator.userAgent;

    if (ua.match(/Android/i)
      || ua.match(/webOS/i)
      || ua.match(/iPhone/i)
      || ua.match(/iPad/i)
      || ua.match(/iPod/i)
      || ua.match(/BlackBerry/i)
      || ua.match(/Windows Phone/i)
    ) {
      return true;
    }
    else {
      return false;
    }
  }
}
