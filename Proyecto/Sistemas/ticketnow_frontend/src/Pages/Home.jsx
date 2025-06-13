import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import splash1 from "../assets/splash-1.jpg";
import splash2 from "../assets/splash-2.jpg";
import splash3 from "../assets/splash-3.jpg";

function Home() {
  const slides = [
    {
      id: "slide1",
      image: splash1,
      title: "Grandes Conciertos",
      description: "Experimenta la música en vivo como nunca antes",
    },
    {
      id: "slide2",
      image: splash2,
      title: "Festivales Increíbles",
      description: "Los mejores festivales de música en un solo lugar",
    },
    {
      id: "slide3",
      image: splash3,
      title: "Shows Espectaculares",
      description: "Vive experiencias únicas e inolvidables",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(slides[0].id);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => {
        const currentIndex = slides.findIndex((slide) => slide.id === current);
        return slides[(currentIndex + 1) % slides.length].id;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/10 via-pink-500/10 to-cyan-500/10 pointer-events-none" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <section className="w-full py-20">
          <div className="container relative mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent">
                ¡Consigue tus Entradas Ahora!
              </h1>
              <p className="text-lg mb-8 text-gray-700">
                Encuentra y reserva entradas para tus conciertos favoritos.
                ¡Únete a miles de amantes de la música y no te pierdas ningún
                espectáculo!
              </p>
              <Link
                to="/register"
                className="btn bg-cyan-600 hover:bg-cyan-500 text-white px-8 border-0"
              >
                Empezar
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full max-w-7xl mx-auto mb-10">
          <div className="carousel relative w-full h-[400px] rounded-2xl shadow-2xl overflow-hidden">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="carousel-item absolute inset-0 w-full transition-all duration-500 ease-in-out"
                style={{
                  opacity: activeSlide === slide.id ? 1 : 0,
                  visibility: activeSlide === slide.id ? "visible" : "hidden",
                }}
              >
                <img
                  src={slide.image}
                  className="w-full h-full object-cover"
                  alt={slide.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                    <p className="text-sm opacity-90">{slide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center w-full py-4 gap-2">
            {slides.map((slide) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(slide.id)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeSlide === slide.id
                    ? "bg-cyan-600"
                    : "bg-white hover:bg-cyan-500"
                }`}
                aria-label={`Ver ${slide.title}`}
              />
            ))}
          </div>
        </section>

        <footer className="bg-gray-900/95 text-gray-300 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">TicketNow</h3>
                <p className="text-sm">
                  Tu plataforma confiable para la compra de tickets para eventos
                  y conciertos.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-cyan-500 transition-colors">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="hover:text-cyan-500 transition-colors">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="hover:text-cyan-500 transition-colors">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">
                  Enlaces Rápidos
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/events"
                      className="hover:text-cyan-500 transition-colors"
                    >
                      Eventos
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="hover:text-cyan-500 transition-colors"
                    >
                      Nosotros
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="hover:text-cyan-500 transition-colors"
                    >
                      Contacto
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="hover:text-cyan-500 transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/privacy"
                      className="hover:text-cyan-500 transition-colors"
                    >
                      Privacidad
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="hover:text-cyan-500 transition-colors"
                    >
                      Términos
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/refund"
                      className="hover:text-cyan-500 transition-colors"
                    >
                      Reembolsos
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Newsletter</h4>
                <p className="text-sm mb-4">
                  Suscríbete para recibir las últimas novedades
                </p>
                <form className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="bg-gray-800 px-4 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    type="submit"
                    className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
              <p>
                &copy; {new Date().getFullYear()} TicketNow. Todos los derechos
                reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
