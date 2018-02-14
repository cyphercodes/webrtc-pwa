import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import sip from 'sip.js';

@Component({
  selector: 'page-dialer',
  templateUrl: 'dialer.html'
})
export class DialerPage {
  enterCount: number = 0;
  @ViewChild('tel') tel;
  @ViewChild('audio') audioElement;

  ua;
  session;

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
    console.log(('sinkId' in HTMLMediaElement.prototype) ? 'Can use sinkId' : 'sinkId usage not ready yet...');

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
      log: {
        builtinEnabled: false
      }
      // 'extraHeaders': [ 'CallerID: <?= $this->session->userdata('dbuser'); ?>', 'CallerID: <?= $this->session->userdata('dbuser'); ?>'],
    }
    this.ua = new sip.UA(config);


  }

  hasSession() {
    return (this.session && !this.session.endTime);
  }

  hangup() {
    this.session.terminate();
  }

  dial() {
    if (this.tel.nativeElement.value.length < 1) {
      return;
    }
    this.session = this.ua.invite(this.tel.nativeElement.value, {
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false
        }
      }
    });

    this.session.on('progress', () => {
      this.session.sessionDescriptionHandler.on('addStream', () => {
        var pc = this.session.sessionDescriptionHandler.peerConnection;
        var remoteStream = new MediaStream();
        pc.getReceivers().forEach(function (receiver) {
          var track = receiver.track;
          if (track) {
            remoteStream.addTrack(track)
          }
        })
        this.audioElement.nativeElement.srcObject = remoteStream;
      });
    });
  }

}
