import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatINR, nightsBetween } from '../utils/format.js';

export default function BookingBox({ listing }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ checkIn: '', checkOut: '', guests: 1 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nights = nightsBetween(form.checkIn, form.checkOut);
  const total = nights * listing.pricePerNight;
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const getTodayISO = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const todayStr = getTodayISO();

  let minCheckOutStr = todayStr;
  if (form.checkIn) {
    const checkInDate = new Date(form.checkIn + 'T00:00:00');
    checkInDate.setDate(checkInDate.getDate() + 1);
    const year = checkInDate.getFullYear();
    const month = String(checkInDate.getMonth() + 1).padStart(2, '0');
    const day = String(checkInDate.getDate()).padStart(2, '0');
    minCheckOutStr = `${year}-${month}-${day}`;
  }

  const book = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login', { state: { from: `/stays/${listing._id}` } });
    setLoading(true);
    setError('');
    try {
      await api.post('/bookings', {
        listingId: listing._id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
      });
      navigate('/trips', { state: { booked: true } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card booking-box" onSubmit={book}>
      <h3>
        {formatINR(listing.pricePerNight)} <span className="muted">/ night</span>
      </h3>
      <div className="row">
        <label className="grow">
          Check-in
          <input type="date" required value={form.checkIn} onChange={set('checkIn')} min={todayStr} />
        </label>
        <label className="grow">
          Check-out
          <input type="date" required value={form.checkOut} onChange={set('checkOut')} min={minCheckOutStr} />
        </label>
      </div>
      <label>
        Guests
        <input type="number" min="1" max={listing.maxGuests} value={form.guests} onChange={set('guests')} />
      </label>
      {nights > 0 && (
        <div className="row-between">
          <span>{formatINR(listing.pricePerNight)} × {nights} night{nights > 1 ? 's' : ''}</span>
          <strong>{formatINR(total)}</strong>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <button className="btn full" disabled={loading}>
        {loading ? 'Booking...' : 'Reserve'}
      </button>
      <p className="muted small">You won't be charged yet. The host will confirm your request.</p>
    </form>
  );
}
