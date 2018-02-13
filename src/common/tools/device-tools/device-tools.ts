import {Injectable} from "@angular/core";

@Injectable()
export class DeviceTools {

  constructor() {

  }

  isSpeakerMedia(device: MediaDeviceInfo) {
    return device.label.match(/speaker/i);
  }

  isHeadsetMedia(device: MediaDeviceInfo) {
    return device.label.match(/headset/i) || device.label.match(/ear/i);
  }

}
