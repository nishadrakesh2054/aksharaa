import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Plus, Calendar, Trash2, Edit, Clock, Search } from "lucide-react";
import { listFromResponse } from "../utils/apiResponse";

const EventsCalendarPage = () => {
  const { user } = useSelector((state) => state.login.loggedInUser);
  const canDeleteRecords = user?.role !== "frontdesk";
  const [activeTab, setActiveTab] = useState("events"); // 'events' or 'calendar'
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDes, setEventDes] = useState("");

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [monthYear, setMonthYear] = useState("");
  const [eventLines, setEventLines] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [eventsRes, calRes] = await Promise.allSettled([
        axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/events`),
        axios.get(`${import.meta.env.VITE_SERVERAPI}/api/v1/calendar`),
      ]);

      if (eventsRes.status === "fulfilled" && eventsRes.value.data) {
        setEvents(listFromResponse(eventsRes.value.data, ["events"]));
      }

      if (calRes.status === "fulfilled" && calRes.value.data) {
        setCalendars(listFromResponse(calRes.value.data, ["calendar"]));
      }
    } catch (error) {
      toast.error("Failed to fetch events and calendar data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Events Handlers
  const openAddEvent = () => {
    setEditingEvent(null);
    setEventTitle("");
    setEventDate("");
    setEventDes("");
    setShowEventModal(true);
  };

  const openEditEvent = (item) => {
    setEditingEvent(item);
    setEventTitle(item.title || "");
    setEventDate(item.date || "");
    setEventDes(item.description || item.des || "");
    setShowEventModal(true);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate.trim()) {
      toast.error("Title and Date are required");
      return;
    }
    try {
      setSubmitting(true);
      const payload = { title: eventTitle, date: eventDate, description: eventDes };
      let res;
      if (editingEvent) {
        res = await axios.put(`${import.meta.env.VITE_SERVERAPI}/api/v1/events/${editingEvent._id}`, payload);
      } else {
        res = await axios.post(`${import.meta.env.VITE_SERVERAPI}/api/v1/events`, payload);
      }

      if (res.data.success) {
        toast.success(res.data.message);
        setShowEventModal(false);
        fetchAllData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await axios.delete(`${import.meta.env.VITE_SERVERAPI}/api/v1/events/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setEvents((prev) => prev.filter((e) => e._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Calendar Handlers
  const openAddCalendar = () => {
    setEditingCalendar(null);
    setMonthYear("");
    setEventLines("");
    setShowCalendarModal(true);
  };

  const openEditCalendar = (item) => {
    setEditingCalendar(item);
    setMonthYear(item.monthYear || item.date || "");
    setEventLines(Array.isArray(item.events) ? item.events.join("\n") : "");
    setShowCalendarModal(true);
  };

  const handleCalendarSubmit = async (e) => {
    e.preventDefault();
    if (!monthYear.trim()) {
      toast.error("Month & Year title is required");
      return;
    }
    try {
      setSubmitting(true);
      const eventsArr = eventLines.split("\n").map((line) => line.trim()).filter(Boolean);
      const payload = { monthYear, events: eventsArr };
      let res;
      if (editingCalendar) {
        res = await axios.put(`${import.meta.env.VITE_SERVERAPI}/api/v1/calendar/${editingCalendar._id}`, payload);
      } else {
        res = await axios.post(`${import.meta.env.VITE_SERVERAPI}/api/v1/calendar`, payload);
      }

      if (res.data.success) {
        toast.success(res.data.message);
        setShowCalendarModal(false);
        fetchAllData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCalendar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this calendar schedule?")) return;
    try {
      const res = await axios.delete(`${import.meta.env.VITE_SERVERAPI}/api/v1/calendar/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setCalendars((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const isEventsTab = activeTab === "events";

  const filteredEvents = events.filter(
    (e) =>
      (e.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.date || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCalendars = calendars.filter(
    (c) =>
      (c.monthYear || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(c.events) ? c.events.join(" ") : "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="main">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "1.25rem" }}>
            Events & Academic Calendar
          </h4>
          <p className="text-muted mb-0 small">
            Manage upcoming school events and monthly calendar schedules shown on /newsactivity.
          </p>
        </div>
        <button
          className="btn btn-executive"
          onClick={isEventsTab ? openAddEvent : openAddCalendar}
        >
          <Plus size={15} /> {isEventsTab ? "Add Upcoming Event" : "Add Calendar Month"}
        </button>
      </div>

      {/* Segmented Filter Tabs & Search Bar */}
      <div className="d-flex align-items-center justify-content-between mb-4 bg-white p-3 rounded-3 border gap-3 flex-wrap shadow-sm">
        <div className="d-flex align-items-center gap-2 p-1 bg-light rounded-3">
          <button
            className={`btn ${isEventsTab ? "btn-primary shadow-sm" : "btn-light text-secondary border-0"} px-4 py-2 rounded-3 fw-semibold`}
            onClick={() => setActiveTab("events")}
          >
            Upcoming Events ({events.length})
          </button>
          <button
            className={`btn ${!isEventsTab ? "btn-primary shadow-sm" : "btn-light text-secondary border-0"} px-4 py-2 rounded-3 fw-semibold`}
            onClick={() => setActiveTab("calendar")}
          >
            Calendar Schedule ({calendars.length})
          </button>
        </div>

        <div className="search-input-wrapper">
          <Search size={15} />
          <input
            type="text"
            className="form-control"
            placeholder={isEventsTab ? "Search events..." : "Search calendar..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="modern-table-container">
        <div className="modern-table-header">
          <div className="d-flex align-items-center gap-2">
            <Calendar size={20} className="text-primary" />
            <h5 className="fw-bold mb-0 text-dark">
              {isEventsTab ? "Upcoming Events Directory" : "Monthly Calendar Directory"}
            </h5>
          </div>
        </div>

        <div className="table-responsive">
          {isEventsTab ? (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Event Date</th>
                  <th>Description</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      Loading events...
                    </td>
                  </tr>
                ) : filteredEvents.length > 0 ? (
                  filteredEvents.map((item) => (
                    <tr key={item._id}>
                      <td className="fw-bold text-dark">{item.title}</td>
                      <td>
                        <span className="badge-status badge-brand">
                          <Clock size={13} /> {item.date}
                        </span>
                      </td>
                      <td className="text-muted small">{item.description || item.des || "N/A"}</td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          <button
                            className="btn-icon btn-icon-warning"
                            title="Edit Event"
                            onClick={() => openEditEvent(item)}
                          >
                            <Edit size={16} />
                          </button>
                          {canDeleteRecords && (
                            <button
                              className="btn-icon btn-icon-danger"
                              title="Delete Event"
                              onClick={() => handleDeleteEvent(item._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      No upcoming events found. Click &quot;+ Add Upcoming Event&quot; to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Month & Year Title</th>
                  <th>Scheduled Events List</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">
                      Loading calendar schedule...
                    </td>
                  </tr>
                ) : filteredCalendars.length > 0 ? (
                  filteredCalendars.map((item) => (
                    <tr key={item._id}>
                      <td className="fw-bold text-dark" style={{ minWidth: "200px" }}>
                        {item.monthYear || item.date}
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {Array.isArray(item.events) && item.events.length > 0 ? (
                            item.events.map((ev, idx) => (
                              <span key={idx} className="badge-status badge-indigo mb-1">
                                {ev}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted small">No specific events listed</span>
                          )}
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          <button
                            className="btn-icon btn-icon-warning"
                            title="Edit Calendar Month"
                            onClick={() => openEditCalendar(item)}
                          >
                            <Edit size={16} />
                          </button>
                          {canDeleteRecords && (
                            <button
                              className="btn-icon btn-icon-danger"
                              title="Delete Calendar Month"
                              onClick={() => handleDeleteCalendar(item._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">
                      No calendar entries found. Click &quot;+ Add Calendar Month&quot; to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Upcoming Event Modal */}
      {showEventModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "600px" }}>
            <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between bg-light rounded-top">
              <div>
                <h6 className="fw-bold mb-0 text-dark">
                  {editingEvent ? "Edit Upcoming Event" : "Add Upcoming Event"}
                </h6>
                <small className="text-muted" style={{ fontSize: "12px" }}>
                  Fill in event title, date, and description
                </small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowEventModal(false)}
              ></button>
            </div>
            <form onSubmit={handleEventSubmit} className="p-3 p-md-4">
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small mb-1">Event Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Exhibition's Day"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small mb-1">Event Date <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small mb-1">Description / Summary:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter details about this event..."
                  value={eventDes}
                  onChange={(e) => setEventDes(e.target.value)}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-light border px-4"
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-executive px-4"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingEvent ? "Update Event" : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Calendar Schedule Modal */}
      {showCalendarModal && (
        <div className="executive-modal-backdrop">
          <div className="executive-modal" style={{ maxWidth: "600px" }}>
            <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between bg-light rounded-top">
              <div>
                <h6 className="fw-bold mb-0 text-dark">
                  {editingCalendar ? "Edit Calendar Month" : "Add Calendar Month Schedule"}
                </h6>
                <small className="text-muted" style={{ fontSize: "12px" }}>
                  Pick date/month and list events (one per line)
                </small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCalendarModal(false)}
              ></button>
            </div>
            <form onSubmit={handleCalendarSubmit} className="p-3 p-md-4">
              <div className="mb-3">
                <label className="form-label fw-semibold small mb-1">Select Date / Month <span className="text-danger">*</span></label>
                <input
                  type="date"
                  className="form-control"
                  value={monthYear}
                  onChange={(e) => setMonthYear(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small mb-1">Events List (One event per line):</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder={"1st: Happy New Year\n4th: Chait Dashain\n10th: School Reopens\n19th: Parent-Teacher Meeting"}
                  value={eventLines}
                  onChange={(e) => setEventLines(e.target.value)}
                ></textarea>
                <small className="text-muted d-block mt-1" style={{ fontSize: "11px" }}>
                  Write each event on a separate line (e.g. <code>10th: Buddha Jayanti</code>).
                </small>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-light border px-4"
                  onClick={() => setShowCalendarModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-executive px-4"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingCalendar ? "Update Schedule" : "Save Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsCalendarPage;
