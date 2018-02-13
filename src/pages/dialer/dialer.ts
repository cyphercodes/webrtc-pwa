import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import sip from 'sip.js';
import {DeviceTools} from "../../common/tools/device-tools/device-tools";

@Component({
  selector: 'page-dialer',
  templateUrl: 'dialer.html'
})
export class DialerPage {

  @ViewChild('tel') tel;
  enterCount: number = 0;

  constructor(public navCtrl: NavController, private deviceTools: DeviceTools) {
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
    let audioElement: any = document.getElementById('remoteAudio');
    console.log('just loaded...');
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      console.log(devices);
      let filtered = devices.filter((device) => {
        return this.deviceTools.isHeadsetMedia(device) || this.deviceTools.isSpeakerMedia(device);
      });
      console.log(devices);
      console.log(filtered);

      console.log(audioElement);
      this.attachSinkId(audioElement, 'default');
      // audioElement.setSinkId(filtered[1].deviceId);

    }).catch((error) => {
      console.log('navigator.getUserMedia error: ', error);
    });

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
      session.sessionDescriptionHandler.on('addStream', () => {
        var pc = session.sessionDescriptionHandler.peerConnection;
        var remoteStream = new MediaStream();
        pc.getReceivers().forEach(function (receiver) {
          var track = receiver.track;
          if (track) {
            remoteStream.addTrack(track)
          }
        })
        audioElement.srcObject = remoteStream;
        console.log(audioElement);
        // audioElement.setSinkId('default');
      });
    });

  }

  attachSinkId(element, sinkId) {
    if (typeof element.sinkId !== 'undefined') {
      element.setSinkId(sinkId)
        .then(function () {
          console.log('Success, audio output device attached: ' + sinkId);
        })
        .catch(function (error) {
          var errorMessage = error;
          if (error.name === 'SecurityError') {
            errorMessage = 'You need to use HTTPS for selecting audio output ' +
              'device: ' + error;
          }
          console.error(errorMessage);
        });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }

}
