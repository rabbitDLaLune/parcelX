import { Component, Input, OnChanges } from '@angular/core';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  imports: [],
  templateUrl: './qr-code.html',
})
export class QrCode implements OnChanges {
  @Input() value = '';
  @Input() label = 'Parcel QR Code';

  qrDataUrl = '';

  async ngOnChanges(): Promise<void> {
    if (!this.value) {
      this.qrDataUrl = '';
      return;
    }

    this.qrDataUrl = await QRCode.toDataURL(this.value, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: 'M',
    });
  }
}
