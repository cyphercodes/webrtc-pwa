import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import sip from 'sip.js';

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

  ionViewDidLoad() {
    let config = {
      uri: '199@webrtc.cyphertel.net',
      ws_servers: 'wss://webrtc.cyphertel.net:8089/ws',
      authorizationUser: '199',
      displayName: '199',
      password: 'abc123#12#ab',
      register: true,
      sessionDescriptionHandlerFactoryOptions: {
        peerConnectionOptions: {
          rtcConfiguration: {
            iceServers: [
              {urls: "stun:stun.l.google.com:19302"},
            ]
          }
        }
      },
      // 'extraHeaders': [ 'CallerID: <?= $this->session->userdata('dbuser'); ?>', 'CallerID: <?= $this->session->userdata('dbuser'); ?>'],
    }
    let ua = new sip.UA(config);

    var session = ua.invite('600', {
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false
        }
      }
    });

    session.on('progress', function () {
      session.sessionDescriptionHandler.on('addStream', function () {
        var pc = session.sessionDescriptionHandler.peerConnection;
        var remoteStream = new MediaStream()
        pc.getReceivers().forEach(function (receiver) {
          var track = receiver.track
          if (track) {
            remoteStream.addTrack(track)
          }
        })
        let audio: any = document.getElementById('remoteAudio');
        audio.srcObject = remoteStream;
      });
    });

  }

}
