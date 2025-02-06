// import { useEffect, useState } from 'react';
// import SlotService from '../../services/slotService';

// interface Slot {
//   id: number;
//   startTime: string;
//   endTime: string;
//   isAvailable: boolean;
// }

// const CarpenterSlots = () => {
//   const [slots, setSlots] = useState<Slot[]>([]);
//   const [startTime, setStartTime] = useState('');
//   const [endTime, setEndTime] = useState('');

//   useEffect(() => {
//     const fetchSlots = async () => {
//       try {
//         const data = await SlotService.getCarpenterSlots();
//         setSlots(data);
//       } catch (error) {
//         console.error("Error fetching slots:", error);
//       }
//     };
//     fetchSlots();
//   }, []);

//   const handleAddSlot = async () => {
//     if (!startTime || !endTime) {
//       alert("Please enter start and end time!");
//       return;
//     }
  
//     // Get today's date in YYYY-MM-DD format
//     const today = new Date().toISOString().split('T')[0];
  
//     // Convert to ISO 8601 format
//     const formattedStartTime = `${today}T${startTime}:00Z`;
//     const formattedEndTime = `${today}T${endTime}:00Z`;
  
//     try {
//       const newSlot = await SlotService.addSlot(formattedStartTime, formattedEndTime);
//       setSlots((prevSlots) => [...prevSlots, newSlot]);
//       setStartTime(''); // Clear input fields
//       setEndTime('');
//     } catch (error) {
//       console.error("Error adding slot:", error);
//     }
//   };
  

//   const handleToggleAvailability = async (slotId: number, isAvailable: boolean) => {
//     try {
//       if (isAvailable) {
//         await SlotService.markSlotUnavailable(slotId);
//       } else {
//         await SlotService.markSlotAvailable(slotId);
//       }
//       setSlots((prevSlots) =>
//         prevSlots.map((slot) =>
//           slot.id === slotId ? { ...slot, isAvailable: !isAvailable } : slot
//         )
//       );
//     } catch (error) {
//       console.error("Error toggling availability:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Manage Your Slots</h2>
//       <div>
//       <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
// <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
// <button onClick={handleAddSlot}>Add Slot</button>

//       </div>
//       {slots.length > 0 ? (
//         slots.map((slot) => (
//           <div key={slot.id}>
//             <p>{slot.startTime} - {slot.endTime} {slot.isAvailable ? "(Available)" : "(Booked)"}</p>
//             <button onClick={() => handleToggleAvailability(slot.id, slot.isAvailable)}>
//               {slot.isAvailable ? "Mark Unavailable" : "Mark Available"}
//             </button>
//           </div>
//         ))
//       ) : (
//         <p>No slots available.</p>
//       )}
//     </div>
//   );
// };

// export default CarpenterSlots;
import { useEffect, useState } from 'react';
import SlotService from '../../services/slotService';

interface Slot {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const CarpenterSlots = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch slots on component mount
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await SlotService.getCarpenterSlots();
        setSlots(data);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setError("Failed to fetch slots. Please try again later.");
      }
    };
    fetchSlots();
  }, []);

  const handleAddSlot = async () => {
    if (!startTime || !endTime) {
      alert("Please enter both start and end time!");
      return;
    }
  
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
  
    // Format the start and end times
    const formattedStartTime = `${today}T${startTime}:00Z`;
    const formattedEndTime = `${today}T${endTime}:00Z`;
  
    try {
      // Attempt to add the new slot
      await SlotService.addSlot(formattedStartTime, formattedEndTime);
      // Refetch the updated list of slots for the carpenter
      const updatedSlots = await SlotService.getCarpenterSlots();
      setSlots(updatedSlots); // Update state with the latest slots
      setStartTime(''); // Clear input fields
      setEndTime('');
    } catch (error) {
      console.error("Error adding slot:", error);
      setError("Failed to add slot. Please try again later.");
    }
  };

  const handleToggleAvailability = async (slotId: number, isAvailable: boolean) => {
    try {
      if (isAvailable) {
        await SlotService.markSlotUnavailable(slotId);
      } else {
        await SlotService.markSlotAvailable(slotId);
      }
      // Refetch the updated list of slots after changing availability
      const updatedSlots = await SlotService.getCarpenterSlots();
      setSlots(updatedSlots); // Update state with latest slots
    } catch (error) {
      console.error("Error toggling availability:", error);
      setError("Failed to toggle slot availability. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Manage Your Slots</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

      <div>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <button onClick={handleAddSlot}>Add Slot</button>
      </div>

      {slots.length > 0 ? (
        slots.map((slot) => (
          <div key={slot.id}>
            <p>
              {slot.startTime} - {slot.endTime}{" "}
              {slot.isAvailable ? "(Available)" : "(Booked)"}
            </p>
            <button
              onClick={() => handleToggleAvailability(slot.id, slot.isAvailable)}
            >
              {slot.isAvailable ? "Mark Unavailable" : "Mark Available"}
            </button>
          </div>
        ))
      ) : (
        <p>No slots available.</p>
      )}
    </div>
  );
};

export default CarpenterSlots;


