import {api} from './api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token'); // Fetch JWT token
  return { headers: { Authorization: `Bearer ${token}` } };
};

const SlotService = {
  // ✅ Fetch available slots
  getAvailableSlots: async (carpenterId?: number) => {
    const response = await api.get('/slots/available', {
      params: carpenterId ? { carpenterId } : {},
    });
    return response.data;
  },

  // ✅ Book a api(User only)
  bookSlot: async (slotId: number) => {
    const response = await api.post('/bookings', { slotId }, getAuthHeader());
    return response.data;
  },

  // ✅ Fetch slots assigned to a carpenter
  getCarpenterSlots: async () => {
    const response = await api.get('/bookings/carpenter', getAuthHeader());
    return response.data;
  },

  // ✅ Add a new slot (Carpenter only)
  addSlot: async (startTime: string, endTime: string) => {
    try {
      console.log("Sending slot data:", { startTime, endTime }); // Debug log
      const response = await api.post('/slots/create', { startTime, endTime }, getAuthHeader());
      return response.data;
    } catch (error: any) {
      console.error("Error adding slot:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Mark a slot as unavailable (Carpenter only)
  markSlotUnavailable: async (slotId: number) => {
    const response = await api.patch(`/slots/${slotId}/unavailable`, {}, getAuthHeader());
    return response.data;
  },

  // ✅ Mark a slot as available (Carpenter only)
  markSlotAvailable: async (slotId: number) => {
    const response = await api.patch(`/slots/${slotId}/available`, {}, getAuthHeader());
    return response.data;
  },

  // ✅ Get booked slots for the logged-in user
  getBookedSlots: async () => {
    const response = await api.get('/bookings/user', getAuthHeader());
    return response.data;
  },

  // ✅ Cancel a booking (User only)
  cancelBooking: async (bookingId: number) => {
    const response = await api.delete(`/bookings/${bookingId}/cancel`, getAuthHeader());
    return response.data;
  },
};

export default SlotService;
