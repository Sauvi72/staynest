/**
 * HTML Email Templates for StayNest Notifications
 */

export const getNewBookingTemplate = ({ booking, listing, guest, host }) => {
  const checkIn = new Date(booking.checkIn).toLocaleDateString('en-IN', {
    dateStyle: 'medium',
  });
  const checkOut = new Date(booking.checkOut).toLocaleDateString('en-IN', {
    dateStyle: 'medium',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2a2420; background: #fbf8f4; margin: 0; padding: 24px; }
        .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #ece4da; padding: 32px; }
        .logo { color: #e0573a; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        h2 { margin-top: 0; color: #2a2420; }
        .details { background: #fbf8f4; border-radius: 8px; padding: 16px; margin: 20px 0; }
        .details p { margin: 6px 0; }
        .btn { display: inline-block; background: #e0573a; color: #ffffff !important; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
        .footer { font-size: 13px; color: #7a6f66; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">🏡 StayNest</div>
        <h2>New Booking Request!</h2>
        <p>Hello ${host.name || 'Host'},</p>
        <p>You have received a new booking request for <strong>${listing.title}</strong>.</p>
        
        <div class="details">
          <p><strong>Guest:</strong> ${guest.name || 'A guest'} (${guest.email})</p>
          <p><strong>Dates:</strong> ${checkIn} → ${checkOut} (${booking.nights} night${booking.nights > 1 ? 's' : ''})</p>
          <p><strong>Guests:</strong> ${booking.guests}</p>
          <p><strong>Total Payout:</strong> ₹${Number(booking.totalPrice).toLocaleString('en-IN')}</p>
        </div>

        <p>Please log in to your Host Dashboard to accept or decline this reservation.</p>
        <div class="footer">Thank you for hosting with StayNest.</div>
      </div>
    </body>
    </html>
  `;
};

export const getBookingStatusTemplate = ({ booking, status }) => {
  const isConfirmed = status === 'confirmed';
  const checkIn = new Date(booking.checkIn).toLocaleDateString('en-IN', {
    dateStyle: 'medium',
  });
  const checkOut = new Date(booking.checkOut).toLocaleDateString('en-IN', {
    dateStyle: 'medium',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2a2420; background: #fbf8f4; margin: 0; padding: 24px; }
        .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #ece4da; padding: 32px; }
        .logo { color: #e0573a; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        h2 { margin-top: 0; color: #2a2420; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-weight: 600; font-size: 14px; text-transform: uppercase; }
        .confirmed { background: #eaf6ee; color: #2f8f5b; }
        .declined { background: #fdeeee; color: #c62f3b; }
        .details { background: #fbf8f4; border-radius: 8px; padding: 16px; margin: 20px 0; }
        .details p { margin: 6px 0; }
        .footer { font-size: 13px; color: #7a6f66; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">🏡 StayNest</div>
        <h2>Booking Request Update</h2>
        <p>Hello ${booking.guest?.name || 'Guest'},</p>
        <p>Your booking request for <strong>${booking.listing?.title || 'your stay'}</strong> has been:
          <span class="status-badge ${isConfirmed ? 'confirmed' : 'declined'}">
            ${isConfirmed ? 'Confirmed' : 'Declined'}
          </span>
        </p>

        <div class="details">
          <p><strong>Stay:</strong> ${booking.listing?.title || 'Listing'}</p>
          <p><strong>Dates:</strong> ${checkIn} → ${checkOut} (${booking.nights} nights)</p>
          <p><strong>Total:</strong> ₹${Number(booking.totalPrice).toLocaleString('en-IN')}</p>
          <p><strong>Status:</strong> ${isConfirmed ? 'Confirmed — Pack your bags!' : 'Declined by host'}</p>
        </div>

        <p>${isConfirmed ? 'You can view your trip details under My Trips on StayNest.' : 'You were not charged. Feel free to browse other stays on StayNest.'}</p>
        <div class="footer">Happy travels,<br>The StayNest Team</div>
      </div>
    </body>
    </html>
  `;
};
