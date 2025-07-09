import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';

export default function CryptoMiningCalculator() {
  const [hashRate, setHashRate] = useState(''); // in TH/s
  const [powerConsumption, setPowerConsumption] = useState(''); // in Watts
  const [electricityCost, setElectricityCost] = useState(''); // $ per kWh
  const [poolFee, setPoolFee] = useState(''); // %
  const [coinPrice, setCoinPrice] = useState(''); // $ per coin
  const [blockReward, setBlockReward] = useState('6.25'); // coins per block (Bitcoin default)
  const [networkDifficulty, setNetworkDifficulty] = useState(''); // network difficulty (unitless)

  const [result, setResult] = useState(null);

  const calculateProfit = () => {
    const H = parseFloat(hashRate);
    const P = parseFloat(powerConsumption);
    const E = parseFloat(electricityCost);
    const F = parseFloat(poolFee);
    const C = parseFloat(coinPrice);
    const R = parseFloat(blockReward);
    const D = parseFloat(networkDifficulty);

    if ([H, P, E, F, C, R, D].some(v => isNaN(v) || v < 0)) {
      setResult({ error: 'Please enter valid non-negative numbers for all fields.' });
      return;
    }
    if (H === 0 || D === 0) {
      setResult({ error: 'Hash rate and network difficulty must be greater than zero.' });
      return;
    }

    // Constants for Bitcoin mining
    // Hash rate unit conversion: TH/s to H/s (1 TH/s = 10^12 H/s)
    const hashRateH = H * 1e12;

    // Calculate number of hashes needed per block on average = network difficulty * 2^32
    const hashesPerBlock = D * Math.pow(2, 32);

    // Average number of blocks mined per second by the entire network
    // Bitcoin block time ~600 seconds (10 minutes)
    const blocksPerSecond = 1 / 600;

    // Your expected blocks mined per second = your hash rate / hashesPerBlock * blocksPerSecond
    const blocksMinedPerSecond = (hashRateH / hashesPerBlock) * blocksPerSecond;

    // Your daily mined coins = blocks mined per second * block reward * seconds per day
    const secondsPerDay = 86400;
    const coinsPerDay = blocksMinedPerSecond * R * secondsPerDay;

    // Electricity cost per day (kWh) = power consumption (W) * 24 / 1000 * electricity cost ($/kWh)
    const electricityCostPerDay = (P * 24 / 1000) * E;

    // Pool fee deduction
    const poolFeeDecimal = F / 100;
    const coinsAfterFee = coinsPerDay * (1 - poolFeeDecimal);

    // Profit per day in USD
    const revenuePerDay = coinsAfterFee * C;
    const profitPerDay = revenuePerDay - electricityCostPerDay;

    setResult({
      coinsPerDay,
      electricityCostPerDay,
      revenuePerDay,
      profitPerDay,
    });
  };

  return (
    <>
      <Head>
        <title>Crypto Mining Calculator</title>
        <meta name="description" content="Estimate your mining profitability based on hash rate, power consumption, and electricity costs." />
      </Head>

      <main className="bg-dark text-white p-4 min-vh-100">
        <div className="mb-4">
          <Link href="/" className="btn btn-secondary">
            ← Back to Home
          </Link>
        </div>

        <div className="container" style={{ maxWidth: 600 }}>
          <h1 className="mb-4 text-center">Crypto Mining Calculator</h1>

          <div className="mb-3">
            <label className="form-label">Hash Rate (TH/s)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 100"
              value={hashRate}
              onChange={e => setHashRate(e.target.value)}
              min="0"
              step="any"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Power Consumption (Watts)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 3000"
              value={powerConsumption}
              onChange={e => setPowerConsumption(e.target.value)}
              min="0"
              step="any"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Electricity Cost ($/kWh)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 0.12"
              value={electricityCost}
              onChange={e => setElectricityCost(e.target.value)}
              min="0"
              step="any"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Pool Fee (%)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 1.5"
              value={poolFee}
              onChange={e => setPoolFee(e.target.value)}
              min="0"
              step="any"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Coin Price ($)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 30000"
              value={coinPrice}
              onChange={e => setCoinPrice(e.target.value)}
              min="0"
              step="any"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Block Reward (coins)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 6.25"
              value={blockReward}
              onChange={e => setBlockReward(e.target.value)}
              min="0"
              step="any"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Network Difficulty</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 30e12 (30 trillion)"
              value={networkDifficulty}
              onChange={e => setNetworkDifficulty(e.target.value)}
              min="0"
              step="any"
            />
          </div>

          <button className="btn btn-primary w-100 mb-3" onClick={calculateProfit}>
            Calculate Profitability
          </button>

          {result?.error && (
            <div className="alert alert-danger" role="alert">
              {result.error}
            </div>
          )}

          {result && !result.error && (
            <div className="mt-4 fs-5">
              <p>Estimated coins mined per day: <strong>{result.coinsPerDay.toFixed(6)}</strong></p>
              <p>Electricity cost per day: <strong>${result.electricityCostPerDay.toFixed(2)}</strong></p>
              <p>Revenue per day: <strong>${result.revenuePerDay.toFixed(2)}</strong></p>
              <p>Estimated profit per day: <strong>${result.profitPerDay.toFixed(2)}</strong></p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
