
import React, { useState } from 'react';
import { Fingerprint, Mic, ShieldCheck, Loader2 } from 'lucide-react';
import { processBiometricPayment } from '../services/avbetPayment';
import { createPatternFromMockup } from '../services/capService';
import { produceGarmentCAP } from '../services/liveItFactory';
import { registerInCloset } from '../services/smartCloset';
import { requestEPCTTest } from '../services/epctService';

interface Props {
  onSuccess: () => void;
}

export const BiometricCheckout: React.FC<Props> = ({ onSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'processing' | 'success'>('idle');
  const [log, setLog] = useState<string>('');

  const processFlow = async () => {
    setStatus('verifying');
    setLog('Initializing AVBET Biometric Scan...');

    try {
      // 1. Biometric Payment
      const payment = await processBiometricPayment('demo@tryon.app', 89.00);
      
      if (!payment.authorized) {
        setLog('Payment unauthorized. Biometric mismatch.');
        setStatus('idle');
        return;
      }

      setStatus('processing');
      setLog('Payment Authorized. Initializing CAP...');

      // 2. CAP Pattern Creation
      // In a real app, we would pass the selected mockup ID here
      const pattern = createPatternFromMockup('MK-SELECTED');
      setLog(`Pattern generated: ${pattern.sku}`);

      // 3. LiveIt JIT Production
      const production = await produceGarmentCAP({ patternFile: pattern.patternFile, sku: pattern.sku });
      setLog(`Sent to factory. Order ID: ${production.orderId}`);

      // 4. Smart Closet Registration
      registerInCloset('demo@tryon.app', { 
        sku: pattern.sku, 
        mockupId: 'MK-SELECTED', 
        orderId: production.orderId 
      });
      setLog('Registered in Smart Closet.');

      // 5. EPCT Watcher (Ultimatum Requirement)
      await requestEPCTTest({
        inventor: 'System Automation',
        description: `Auto-generated transaction ${production.orderId} validated by Ultimatum Patent Flow`
      });
      setLog('EPCT Validation Complete.');

      setStatus('success');
      setTimeout(onSuccess, 1500);

    } catch (error) {
      console.error(error);
      setLog('Critical Error in Ultimatum Flow.');
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
      <div className="p-8 bg-slate-900 text-white text-center">
        <ShieldCheck size={48} className="mx-auto mb-4 text-green-400" />
        <h2 className="text-2xl font-bold">AVBET Secure Pay</h2>
        <p className="text-slate-400">Dual Biometric Validation (Iris + Voice)</p>
      </div>

      <div className="p-8 space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-2">Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">FGT Mockup (White Base + Print)</span>
            <span className="font-medium">89.00€</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-slate-600">CAP Shipping (Auto)</span>
            <span className="font-medium">0.00€</span>
          </div>
          <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>89.00€</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className={`flex items-center gap-4 p-4 border rounded-xl transition-colors ${status === 'verifying' ? 'border-rose-500 bg-rose-50' : 'border-slate-200'}`}>
            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
              <Fingerprint size={20} />
            </div>
            <div>
              <p className="font-medium text-slate-900">Iris ID</p>
              <p className="text-xs text-slate-500">{status === 'verifying' ? 'Scanning...' : 'Ready to scan'}</p>
            </div>
          </div>

          <div className={`flex items-center gap-4 p-4 border rounded-xl transition-colors ${status === 'verifying' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Mic size={20} />
            </div>
            <div>
              <p className="font-medium text-slate-900">Voice Print</p>
              <p className="text-xs text-slate-500">{status === 'verifying' ? 'Listening...' : 'Ready to verify'}</p>
            </div>
          </div>
        </div>

        {log && (
          <div className="p-3 bg-slate-100 rounded-lg text-xs font-mono text-slate-600 border border-slate-200">
             > {log}
          </div>
        )}

        <button 
          onClick={processFlow}
          disabled={status !== 'idle'}
          className="w-full py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {status === 'idle' ? "Authorize Payment" : (
            <>
              <Loader2 className="animate-spin" size={20} /> Processing Ultimatum Flow...
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400">
          By confirming, the order is sent to CAP auto-production and registered in your Smart Closet.
        </p>
      </div>
    </div>
  );
};
