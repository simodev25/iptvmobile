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

@Injectable()
export class PingService {

  constructor(private _http: Http) {

  }

  public chekUrk(lien: string): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {

      var subscription = this._http.request(lien).map(res => {

        if (res.status < 200 || res.status >= 300) {

          resolve(false);

        }

        resolve(true);
      })
        .subscribe((data) => {

          subscription.unsubscribe();
          resolve(true);

        },  // Reach here if res.status >= 200 && <= 299
        err => {
          console.log(err)

          resolve(false);

        });
    });




  }
}
