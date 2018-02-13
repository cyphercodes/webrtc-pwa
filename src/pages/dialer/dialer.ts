import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-dialer',
  templateUrl: 'dialer.html'
})
export class DialerPage {

  @ViewChild('tel') tel;
  enterCount: number = 0;

  constructor(public navCtrl: NavController) {

  }

  ionViewDidEnter() {
    if (this.enterCount > 0) {
      setTimeout(() => {
        this.tel.nativeElement.focus();
        this.tel.nativeElement.scrollIntoView();
      }, 200);
    }
    this.enterCount++;
  }

}
