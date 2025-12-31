'use client';

import { QRCodeSVG } from 'qrcode.react';

interface GatePassQRProps {
    token: string;
}

export default function GatePassQR({ token }: GatePassQRProps) {
    // Create a structured payload that the guard's scanner expects
    const qrPayload = JSON.stringify({
        type: 'GATE_PASS',
        token: token
    });

    return (
        <div className="bg-white p-4 rounded-2xl inline-block shadow-lg">
            <QRCodeSVG
                value={qrPayload}
                size={160}
                level="H"
                includeMargin={false}
            />
        </div>
    );
}
