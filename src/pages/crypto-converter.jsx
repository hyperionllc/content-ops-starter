import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';

export default function CryptoConverter() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('bitcoin');
  const [toCurrency, setToCurrency] = useState('ethereum');
  const [result, setResult] = useState('');

  const currencies = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)' },
    { value: 'ethereum', label: 'Ethereum (ETH)' },
    { value: 'tether', label: 'Tether (USDT)' },
    { value: 'binancecoin', label: 'Binance Coin (BNB)' },
    { value: 'solana', label: 'Solana (SOL)' },
    { value: 'usd-coin', label: 'USD Coin (USDC)' },
    { value: 'ripple', label: 'XRP (XRP)' },
    { value: 'ton', label: 'Toncoin (TON)' },
    { value: 'cardano', label: 'Cardano (ADA)' },
    { value: 'dogecoin', label: 'Dogecoin (DOGE)' }
  ];

  const convert = async () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setResult('Please enter a valid amount.');
      return;
    }

    if (fromCurrency === toCurrency) {
      setResult(`You still have ${amt} ${toCurrency.toUpperCase()}.`);
      return;
    }

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency},${toCurrency}&vs_currencies=usd`
      );
      const data = await response.json();

      const fromPrice = data[fromCurrency].usd;
      const toPrice = data[toCurrency].usd;
      const amountInUSD = amt * fromPrice;
      const convertedAmount = amountInUSD / toPrice;

      setResult(`${amt} ${fromCurrency.toUpperCase()} = ${convertedAmount.toFixed(6)} ${toCurrency.toUpperCase()}`);
    } catch (error) {
      setResult('Error fetching crypto prices.');
    }
  };

  return (
    <>
      <Head>
        <title>Crypto Currency Converter</title>
        <meta name="description" content="Convert between Bitcoin, Ethereum, and other top cryptocurrencies easily." />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      </Head>

      <main className="bg-dark text-white p-4 min-vh-100">
        <div className="mb-4">
          <Link href="/" className="btn btn-secondary">
            ← Back to Home
          </Link>
        </div>

        <div className="container">
          <h1 className="mb-4 text-center">Crypto Currency Converter</h1>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="any"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="fromCurrency" className="form-label">From Currency</label>
            <select
              className="form-select"
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="toCurrency" className="form-label">To Currency</label>
            <select
              className="form-select"
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary w-100 mb-3" onClick={convert}>
            Convert
          </button>

          <div className="fs-4 text-center">{result}</div>

          <div className="mt-5 text-center">
            <p>🔗 <a href="#" className="text-info">Check out our recommended crypto exchanges!</a></p>
          </div>
        </div>
      </main>
    </>
  );
}
