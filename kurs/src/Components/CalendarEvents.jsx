import React, {useState, useEffect, useCallback} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getCalendarEvents, addCalendarEvent } from "../api/auth";
import axios from "axios";


const CalendarEvents = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: "", eventDate: "" });
    
    // Dynamiczny rok wyświetlania - domyślnie obecny
    const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();

    const months = [
        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ];

    // Pobieranie wydarzeń dla konkretnego roku (displayYear)
    const fetchEvents = useCallback(async () => {
        try {
            const data = await getCalendarEvents(displayYear);
            setEvents(data);
        } catch (error) {
            console.error("Błąd podczas ładowania kalendarza:", error);
        }
    }, [displayYear]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (!newEvent.title || !newEvent.eventDate) return;

        try {
            await addCalendarEvent(newEvent);
            
            // Sprawdzamy rok dodawanego wydarzenia
            const selectedYear = new Date(newEvent.eventDate).getFullYear();
            
            // Jeśli użytkownik dodał coś na inny rok niż obecnie wyświetlany, 
            // przełączamy widok na ten rok
            if (selectedYear !== displayYear) {
                setDisplayYear(selectedYear);
            } else {
                fetchEvents(); // Jeśli ten sam rok, po prostu odświeżamy listę
            }

            setNewEvent({ title: "", eventDate: "" });
        } catch (error) {
            console.error("Błąd podczas dodawania:", error);
            alert("Nie udało się dodać wydarzenia.");
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm("Czy na pewno chcesz usunąć to wydarzenie?")) return;
        
        try {
            await axios.delete(`${API_URL}/api/calendar/event/${eventId}`, {
                withCredentials: true
            });
            fetchEvents();
        } catch (error) {
            console.error("Błąd usuwania:", error);
            alert("Możesz usunąć tylko swoje wpisy.");
        }
    };

    const getEventsForMonth = (monthIndex) => {
        return events.filter(event => {
            const date = new Date(event.eventDate);
            return date.getMonth() === monthIndex;
        });
    };

    return (
        <div className="calendar-container">
            {/* Formularz dodawania */}
            <form onSubmit={handleAddEvent} className="event-form">
                <input 
                    type="text" 
                    placeholder="Nazwa wydarzenia..." 
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                />
                <input 
                    type="date" 
                    value={newEvent.eventDate}
                    onChange={(e) => setNewEvent({...newEvent, eventDate: e.target.value})}
                />
                <button type="submit">Dodaj wydarzenie</button>
                <button type="button" onClick={() => navigate('/member')}>Menu główne</button>
            </form>

            {/* Panel nawigacji latami */}
            <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
                <button onClick={() => setDisplayYear(prev => prev - 1)} style={{ marginRight: '15px' }}>◀</button>
                <span>Rok {displayYear}</span>
                <button onClick={() => setDisplayYear(prev => prev + 1)} style={{ marginLeft: '15px' }}>▶</button>
            </div>

            {/* Grid 3x4 */}
            <div className="calendarEventsGrid">
                {months.map((monthName, index) => (
                    <div key={monthName} className="calendarEventsGridItem">
                        <h3>{monthName}</h3>
                        <div className="event-list">
                            {getEventsForMonth(index).map(event => (
                                <div key={event.id} className="event-item" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{event.eventDate.split('-')[2]}.{event.eventDate.split('-')[1]}</span>
                                        <strong style={{ flex: 1, marginLeft: '10px' }}>{event.title}</strong>
                                        <button 
                                            onClick={() => handleDelete(event.id)}
                                            className="delete-event-btn"
                                            title="Usuń"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: '#666', fontStyle: 'italic', marginTop: '5px' }}>
                                        👤 {event.authorName}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

}



export default CalendarEvents;