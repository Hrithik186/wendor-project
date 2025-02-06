import { useEffect, useState } from 'react';
import SlotService from '../../services/slotService';

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  carpenterName: string;
}

const ReviewBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    SlotService.getBookedSlots()
      .then(setBookings)
      .catch(console.error);
  }, []);

  const handleCancel = async (slotId: number) => {
    await SlotService.cancelBooking(slotId);
    setBookings(bookings.filter((slot) => slot.id !== slotId));
  };

  return (
    <div>
      <h2>Your Bookings</h2>
      {bookings.length > 0 ? (
        bookings.map((slot) => (
          <div key={slot.id}>
            <p>{slot.startTime} - {slot.endTime} with {slot.carpenterName}</p>
            <button onClick={() => handleCancel(slot.id)}>Cancel</button>
          </div>
        ))
      ) : (
        <p>No bookings yet.</p>
      )}
    </div>
  );
};

export default ReviewBooking;

