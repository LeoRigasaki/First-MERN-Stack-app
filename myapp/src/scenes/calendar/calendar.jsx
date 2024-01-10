import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const calendarRef = useRef(null);

  // Custom formatDate function
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };
  //Fetching the events 
  const fetchEvents = async (fetchInfo = null) => {
    const userID = localStorage.getItem('userID');
    let url = `http://localhost:8000/api/events?userID=${userID}`;
    if (fetchInfo) {
      url += `&start=${fetchInfo.startStr}&end=${fetchInfo.endStr}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data.map(event => ({ ...event, id: event._id, title: event.name, start: event.date, allDay: true })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  const updateEventName = async (eventId, newName) => {
    if (newName && newName.trim() !== '') {
      try {
        const response = await fetch(`http://localhost:8000/api/events/${eventId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName })
        });

        if (response.ok) {
          fetchEvents(); // Fetch events again to update the state
        }
      } catch (error) {
        console.error('Error updating event:', error);
      }
    }
  };


  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventAdd = async (selected) => {
    const title = prompt("Please enter a new title for your event");
    if (title) {
      const userID = localStorage.getItem('userID');
      const newEvent = {
        userID,
        name: title,
        date: selected.startStr,
        allDay: selected.allDay
      };

      try {
        const response = await fetch('http://localhost:8000/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent)
        });

        if (response.ok) {
          fetchEvents(); // Fetch events again to update the state
        }
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
  };
  const handleEventDrop = async (info) => {
    const { event, revert } = info;
  
    // Convert to local date and format as 'YYYY-MM-DD'
    const newDate = event.start.toLocaleDateString('en-CA'); // 'en-CA' gives 'YYYY-MM-DD' format
  
    const confirmed = window.confirm(`Are you sure you want to move the event '${event.title}' to ${newDate}?`);
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:8000/api/events/${event.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: newDate })
        });
  
        if (!response.ok) {
          throw new Error('Failed to update event.');
        }
  
        fetchEvents(); // Fetch events again to update the state
      } catch (error) {
        console.error('Error updating event:', error);
        revert(); // Revert the event to its original position in case of error
      }
    } else {
      revert(); // Revert the event to its original position if user cancels
    }
  };
  
  const handleEventClick = async (clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      try {
        const response = await fetch(`http://localhost:8000/api/events/${clickInfo.event.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchEvents(); // Fetch events again to update the state
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {events.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                {editingEventId === event.id ? (
                  <input
                    type="text"
                    defaultValue={event.title}
                    onBlur={() => setEditingEventId(null)}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        await updateEventName(event.id, e.target.value);
                        setEditingEventId(null);
                      }
                    }}
                  />
                ) : (
                  <ListItemText
                    primary={event.title}
                    secondary={<Typography>{formatDate(event.start)}</Typography>}
                    onClick={() => setEditingEventId(event.id)}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            ref={calendarRef}
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={events}
            select={handleEventAdd}
            eventDrop={handleEventDrop}
            eventClick={handleEventClick}
            datesSet={(dateInfo) => fetchEvents(dateInfo)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
