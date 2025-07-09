import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';

export default function DeFiYieldCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [compound, setCompound] = useState(false);
  const [result, setResult] = useState('');

  const calculateYield = () => {
    const P = parseFloat(principal);
    const R = parseFloat(rate) / 100;
    const T = parseFloat(time);

    if (isNaN(P) || isNaN(R) || isNaN(T) || P <= 0 || R <= 0 || T <= 0) {
      setResult('Please enter valid positive numbers.');
      return;
    }

    let earnings;
    if (compound) {
      // Compound interest formula: A = P * (1 + r/n)^(n*t)
      // Assuming daily compounding (n = 365)
      const n = 365;
      earnings = P * Math.pow(1 + R / n, n * T) - P;
    } else {
      // Simple interest
      earnings = P * R * T;
    }

    setResult(`Estimated earnings: ${earnings.toFixed(2)}`);
  };

  return (
    <>
      <Head>
        <title>DeFi Yield Calculator</title>
        <meta name="description" content="Estimate your DeFi earnings based on APY, time, and compounding." />
      </Head>

      <main className="bg-dark text-white p-4 min-vh-100">
        <div className="mb-4">
          <Link href="/" className="btn btn-secondary">
            ← Back to Home
          </Link>
        </div>

        <div className="container">
          <h1 className="mb-4 text-center">DeFi Yield Calculator</h1>

          <div className="mb-3">
            <label className="form-label">Principal (Amount you invest)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter amount (e.g., 1000)"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Annual Yield (%)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter APY or APR (e.g., 12)"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Time (in years)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter time (e.g., 1 for 1 year)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="compound"
              checked={compound}
              onChange={(e) => setCompound(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="compound">Compound Interest (APY)</label>
          </div>

          <button className="btn btn-primary w-100 mb-3" onClick={calculateYield}>
            Calculate Yield
          </button>

          <div className="fs-4 text-center">{result}</div>
        </div>
      </main>
    </>
  );
}
