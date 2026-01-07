import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function logout() {
  await axios.post("${API_URL}/logout", {}, { withCredentials: true });
}

export async function me() {
  const res = await axios.get("${API_URL}/api/me", { withCredentials: true });
  return res.data;
}

export async function usersBorn() {
  const response = await axios.get("${API_URL}/api/birthday", {withCredentials: true});
  return response.data;
}
//pobieranie wydarzenia
export async function getCalendarEvents(currentYear) {
    const response = await axios.get(`${API_URL}/api/calendar/year/${currentYear}`, {
        withCredentials: true
    });
    return response.data;
}

// Dodawanie wydarzenia
export async function addCalendarEvent(eventData) {
    const response = await axios.post(`${API_URL}/api/calendar/add`, eventData, {
        withCredentials: true
    });
    return response.data;
}
//usuwanie zyczenia po ID 

export async function removeWishById(wishId) {
  const response = await axios.delete(`${API_URL}/api/wishes/${wishId}`, {
    withCredentials: true
  });
  return response.data;
}





