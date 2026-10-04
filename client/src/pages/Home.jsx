import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import ListingCard from '../components/ListingCard.jsx';
import Loader from '../components/Loader.jsx';
import { STAY_TYPES } from '../utils/format.js';

const initial = { city: '', type: '', guests: '', maxPrice: '', sort: 'newest' };

export default function Home() {
  const [filters, setFilters] = useState(initial);
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = (params, targetPage = 1) => {
    setLoading(true);
    setError('');
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''));
    api
      .get('/listings', { params: { ...clean, page: targetPage, limit: 8 } })
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setListings(data);
          setPagination({ page: 1, totalPages: 1, total: data.length });
        } else {
          setListings(data.listings || []);
          setPagination({
            page: data.page || 1,
            totalPages: data.totalPages || 1,
            total: data.total || 0,
          });
        }
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    search(initial);
  }, []);

  const set = (key) => (e) => setFilters({ ...filters, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    search(filters, 1);
  };

  const handleSortChange = (e) => {
    const updated = { ...filters, sort: e.target.value };
    setFilters(updated);
    search(updated, 1);
  };

  return (
    <section>
      <div className="hero">
        <h1>Find your next nest.</h1>
        <p className="muted">Homestays, havelis, villas and hostels across India.</p>
        <form className="search-bar card" onSubmit={submit}>
          <input placeholder="Where to? (e.g. Jaipur)" value={filters.city} onChange={set('city')} />
          <select value={filters.type} onChange={set('type')}>
            <option value="">Any type</option>
            {STAY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="number" min="1" placeholder="Guests" value={filters.guests} onChange={set('guests')} />
          <input type="number" min="0" placeholder="Max ₹/night" value={filters.maxPrice} onChange={set('maxPrice')} />
          <button className="btn">Search</button>
        </form>
      </div>

      <div className="row-between" style={{ margin: '24px 0 16px', flexWrap: 'wrap', gap: '12px' }}>
        <p className="muted" style={{ margin: 0 }}>
          {pagination.total} stay{pagination.total !== 1 ? 's' : ''} available
        </p>
        <div className="row" style={{ gap: '8px' }}>
          <label style={{ flexDirection: 'row', alignItems: 'center', gap: '6px', margin: 0 }}>
            <span>Sort:</span>
            <select
              value={filters.sort || 'newest'}
              onChange={handleSortChange}
              style={{ width: 'auto', padding: '6px 12px' }}
            >
              <option value="newest">Newest first</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </label>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <Loader />
      ) : listings.length === 0 ? (
        <p className="muted">No stays match your search.</p>
      ) : (
        <>
          <div className="grid">
            {listings.map((l) => <ListingCard key={l._id} listing={l} />)}
          </div>
          {pagination.totalPages > 1 && (
            <div className="row" style={{ justifyContent: 'center', gap: '16px', margin: '36px 0 16px' }}>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={pagination.page <= 1 || loading}
                onClick={() => search(filters, pagination.page - 1)}
              >
                ← Previous
              </button>
              <span className="muted" style={{ alignSelf: 'center', fontSize: '0.9rem' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => search(filters, pagination.page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
