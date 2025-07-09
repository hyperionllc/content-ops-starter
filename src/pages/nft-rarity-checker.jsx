import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';

export default function NFTRarityChecker() {
  const [totalSupply, setTotalSupply] = useState('');
  const [traits, setTraits] = useState([{ traitName: '', traitCount: '' }]);
  const [result, setResult] = useState(null);

  const handleTraitChange = (index, field, value) => {
    const updatedTraits = [...traits];
    updatedTraits[index][field] = value;
    setTraits(updatedTraits);
  };

  const addTraitField = () => {
    setTraits([...traits, { traitName: '', traitCount: '' }]);
  };

  const calculateRarity = () => {
    const supply = parseFloat(totalSupply);
    if (isNaN(supply) || supply <= 0) {
      setResult({ error: 'Please enter a valid total supply.' });
      return;
    }

    let score = 0;
    let missingData = false;

    traits.forEach(({ traitCount }) => {
      const count = parseFloat(traitCount);
      if (isNaN(count) || count <= 0) {
        missingData = true;
        return;
      }
      const traitRarity = 1 / (count / supply); // Inverse of trait frequency
      score += traitRarity;
    });

    if (missingData) {
      setResult({ error: 'Please enter valid positive numbers for all trait counts.' });
      return;
    }

    setResult({
      score: score.toFixed(2),
      note: 'Higher score = rarer NFT (basic calculation).',
    });
  };

  return (
    <>
      <Head>
        <title>NFT Rarity Checker</title>
        <meta name="description" content="Estimate the rarity score of an NFT based on its traits." />
      </Head>

      <main className="bg-dark text-white p-4 min-vh-100">
        <div className="mb-4">
          <Link href="/" className="btn btn-secondary">
            ← Back to Home
          </Link>
        </div>

        <div className="container" style={{ maxWidth: 600 }}>
          <h1 className="mb-4 text-center">NFT Rarity Checker</h1>

          <div className="mb-3">
            <label className="form-label">Total Collection Supply</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 10000"
              value={totalSupply}
              onChange={(e) => setTotalSupply(e.target.value)}
              min="0"
              step="any"
            />
          </div>

          {traits.map((trait, index) => (
            <div className="mb-3" key={index}>
              <label className="form-label">Trait #{index + 1} Name & Count</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Trait Type (e.g. Hat)"
                  value={trait.traitName}
                  onChange={(e) => handleTraitChange(index, 'traitName', e.target.value)}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Trait Count (e.g. 500)"
                  value={trait.traitCount}
                  onChange={(e) => handleTraitChange(index, 'traitCount', e.target.value)}
                  min="0"
                />
              </div>
            </div>
          ))}

          <button className="btn btn-outline-light w-100 mb-3" onClick={addTraitField}>
            ➕ Add Another Trait
          </button>

          <button className="btn btn-primary w-100 mb-3" onClick={calculateRarity}>
            Calculate Rarity
          </button>

          {result?.error && (
            <div className="alert alert-danger" role="alert">
              {result.error}
            </div>
          )}

          {result && !result.error && (
            <div className="mt-4 fs-5">
              <p>Rarity Score: <strong>{result.score}</strong></p>
              <p className="text-muted">{result.note}</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
