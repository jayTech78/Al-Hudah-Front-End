import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import api from "@/utils/api";

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data: response } = await api.get("/event/getEvents"
        );

        if (response.status && Array.isArray(response.events)) {
          // Map `date` to `start` for FullCalendar compatibility
          const formattedEvents = response.events.map((event) => ({
            event: event.event,
            eventDate: event.eventDate,
          }));
          // console.log(events)
          setEvents(formattedEvents);
        } else {
          console.warn("Unexpected response format:", response);
        }
      } catch (error) {
        console.error(
          "Error fetching events:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="d-flex justify-content-center">
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className=" border rounded-3 p-5 shadow bg-white">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            
          />
        </div>
      )}
    </div>
  );
};

export default EventCalendar;