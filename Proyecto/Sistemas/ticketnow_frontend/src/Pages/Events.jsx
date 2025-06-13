import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
} from "react-share";
import splashImage from "../assets/splash-1.jpg";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const eventsPerPage = 10;

  const fetchEvents = async (search = "") => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/events${
          search ? `?search=${search}` : ""
        }`
      );
      const data = await response.json();
      setEvents(data);
      setTotalPages(Math.ceil(data.length / eventsPerPage));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEvents(searchTerm);
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getShareUrl = (eventId) => {
    return `${window.location.origin}/events/${eventId}`;
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/10 via-pink-500/10 to-cyan-500/10 pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
              Eventos Disponibles
            </h1>

            {/* Buscador */}
            <form onSubmit={handleSearch} className="mt-4 md:mt-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar eventos..."
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
            </div>
          ) : (
            <>
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No se encontraron eventos</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentEvents.map((event) => (
                      <div
                        key={event.event_id}
                        className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        <img
                          src={event.image || splashImage}
                          alt={event.event_name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-xl font-semibold mb-2">
                            {event.event_name}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {event.short_description}
                          </p>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-cyan-600 font-bold">
                              ${event.base_price}
                            </span>
                            <Link
                              to={`/events/${event.event_id}`}
                              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              Ver Detalles
                            </Link>
                          </div>

                          {/* Botones de compartir */}
                          <div className="flex gap-2 mt-4 justify-center border-t pt-4">
                            <FacebookShareButton
                              url={getShareUrl(event.event_id)}
                              quote={event.event_name}
                            >
                              <FacebookIcon size={32} round />
                            </FacebookShareButton>

                            <TwitterShareButton
                              url={getShareUrl(event.event_id)}
                              title={event.event_name}
                              via="TicketNow"
                            >
                              <TwitterIcon size={32} round />
                            </TwitterShareButton>

                            <WhatsappShareButton
                              url={getShareUrl(event.event_id)}
                              title={event.event_name}
                            >
                              <WhatsappIcon size={32} round />
                            </WhatsappShareButton>

                            <TelegramShareButton
                              url={getShareUrl(event.event_id)}
                              title={event.event_name}
                            >
                              <TelegramIcon size={32} round />
                            </TelegramShareButton>
                          </div>

                          {/* Tooltip para compartir */}
                          <div className="text-xs text-center text-gray-500 mt-2">
                            Comparte este evento con tus amigos
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center space-x-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === i + 1
                            ? "bg-cyan-600 text-white"
                            : "bg-white/80 hover:bg-cyan-500 hover:text-white"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Events;
