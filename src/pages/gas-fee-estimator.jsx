import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';

export default function EthereumGasFeeEstimator() {
  const [gasPrice, setGasPrice] = useState('');
  const [gasLimit, setGasLimit] = useState('');
  const [ethPrice, setEthPrice] = useState('');
  const [result, setResult] = useState(null);

  const calculateFee = () => {
    const G = parseFloat(gasPrice); // Gwei
    const L = parseFloat(gasLimit);
    const P = parseFloat(ethPrice); // USD per ETH

    if ([G, L, P].some(v => isNaN(v) || v <= 0)) {
      setResult({ error: 'Please enter valid positive numbers.' });
      return;
    }

    // Convert Gwei to ETH: gasUsed * gasPrice(Gwei) * 1e-9
    const feeEth = L * G * 1e-9;
    const feeUsd = feeEth * P;

    setResult({
      feeEth,
      feeUsd,
    });
  };

  return (
    <>
      <Head>
        <title>Ethereum Gas Fee Estimator</title>
        <meta name="description" content="Estimate Ethereum transaction fees based on gas price and ETH price." />
      </Head>

      <main className="bg-dark text-white p-4 min-vh-100">
        <div className="mb-4">
          <Link href="/" className="btn btn-secondary">
            ← Back to Home
          </Link>
        </div>

        <div className="container" style={{ maxWidth: 600 }}>
          <h1 className="mb-4 text-center">Ethereum Gas Fee Estimator</h1>

          <div className="mb-3">
            <label className="form-label">Gas Price (Gwei)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 25"
              value={gasPrice}
              onChange={e => setGasPrice(e.target.value)}
              min="0"
              step="any"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Gas Limit</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 21000"
              value={gasLimit}
              onChange={e => setGasLimit(e.target.value)}
              min="0"
              step="any"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">ETH Price (USD)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 3000"
              value={ethPrice}
              onChange={e => setEthPrice(e.target.value)}
              min="0"
              step="any"
            />
          </div>

          <button className="btn btn-primary w-100 mb-3" onClick={calculateFee}>
            Calculate Gas Fee
          </button>

          {result?.error && (
            <div className="alert alert-danger" role="alert">
              {result.error}
            </div>
          )}

          {result && !result.error && (
            <div className="mt-4 fs-5">
              <p>Estimated Gas Fee: <strong>{result.feeEth.toFixed(6)} ETH</strong></p>
              <p>Equivalent in USD: <strong>${result.feeUsd.toFixed(2)}</strong></p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
