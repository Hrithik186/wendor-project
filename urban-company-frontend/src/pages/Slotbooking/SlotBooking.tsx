import { useEffect, useState } from 'react';
import SlotService from '../../services/slotService';

interface Slot {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  carpenterName: string;
}

const SlotBooking = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  useEffect(() => {
    SlotService.getAvailableSlots()
      .then(setSlots)
      .catch(console.error);
  }, []);

  const handleBooking = async (slotId: number) => {
    await SlotService.bookSlot(slotId);
    setSlots(slots.map(slot => 
      slot.id === slotId ? { ...slot, isAvailable: false } : slot
    ));
    setSelectedSlot(slotId);
  };

  return (
    <div>
      <h2>Book a Slot</h2>
      {slots.length > 0 ? (
        slots.map(slot => (
          <div key={slot.id}>
            <p>{slot.startTime} - {slot.endTime} with {slot.carpenterName}</p>
            <button 
              onClick={() => handleBooking(slot.id)} 
              disabled={!slot.isAvailable}
            >
              {slot.isAvailable ? "Book" : "Booked"}
            </button>
          </div>
        ))
      ) : (
        <p>No available slots.</p>
      )}
      {selectedSlot && <p>Slot booked successfully!</p>}
    </div>
  );
};

export default SlotBooking;



