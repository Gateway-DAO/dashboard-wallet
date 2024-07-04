import { forwardRef, useRef } from 'react';

import { onSaveSVG } from '@/utils/save-svg';
import QRCode, { QRCodeProps } from 'react-qr-code';

const GtwQRCode = forwardRef(function GtwQRCode(
  props: Omit<QRCodeProps, 'ref'>,
  ref: any
) {
  const qrRef = useRef<SVGElement>(null);

  return (
    <>
      <QRCode
        {...props}
        ref={ref ?? qrRef}
        viewBox="0 0 256 256"
        style={{
          height: 'auto',
          maxWidth: '100%',
          width: '100%',
        }}
      />
      {process.env.NODE_ENV === 'development' && (
        <button onClick={() => onSaveSVG((ref ?? qrRef).current)}>Print</button>
      )}
    </>
  );
});

export default GtwQRCode;
