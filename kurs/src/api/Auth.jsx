import axios from "axios";

export async function logout() {
  await axios.post("http://localhost:8099/logout", {}, { withCredentials: true });
}

export async function me() {
  const res = await axios.get("http://localhost:8099/api/me", { withCredentials: true });
  return res.data;
}

export async function usersBorn() {
  const response = await axios.get("http://localhost:8099/api/birthday", {withCredentials: true});
  return response.data;
}
//pobieranie wydarzenia
export async function getCalendarEvents(currentYear) {
    const response = await axios.get(`http://localhost:8099/api/calendar/year/${currentYear}`, {
        withCredentials: true
    });
    return response.data;
}

// Dodawanie wydarzenia
export async function addCalendarEvent(eventData) {
    const response = await axios.post(`http://localhost:8099/api/calendar/add`, eventData, {
        withCredentials: true
    });
    return response.data;
}
//usuwanie zyczenia po ID 

export async function removeWishById(wishId) {
  const response = await axios.delete(`http://localhost:8099/api/wishes/${wishId}`, {
    withCredentials: true
  });
  return response.data;
}





