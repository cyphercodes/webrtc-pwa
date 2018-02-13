import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-dialer',
  templateUrl: 'dialer.html'
})
export class DialerPage {

  @ViewChild('tel') tel;

  constructor(public navCtrl: NavController) {

  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.tel.nativeElement.focus();
      this.tel.nativeElement.scrollIntoView();
    }, 300);
  }

}
