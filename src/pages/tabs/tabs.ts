import {Component} from '@angular/core';

import {AccountPage} from '../account/account';
import {DialerPage} from '../dialer/dialer';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = DialerPage;
  tab2Root = AccountPage;

  constructor() {

  }
}
