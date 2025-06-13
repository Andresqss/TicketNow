import React from "react";

function VenueMap({ onSeatSelect, selectedSeats }) {
  const sections = [
    {
      id: "vip",
      name: "VIP",
      price: 200,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      capacity: 50,
    },
    {
      id: "preferential",
      name: "Preferencial",
      price: 150,
      color: "bg-cyan-500",
      hoverColor: "hover:bg-cyan-600",
      capacity: 100,
    },
    {
      id: "general",
      name: "General",
      price: 100,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      capacity: 200,
    },
  ];

  const handleSectionClick = (section) => {
    onSeatSelect({
      id: section.id,
      name: section.name,
      price: section.price,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Escenario */}
      <div className="w-full h-24 bg-gray-800 rounded-t-xl mb-8 flex items-center justify-center">
        <span className="text-white text-xl font-bold">ESCENARIO</span>
      </div>

      {/* Mapa de secciones */}
      <div className="space-y-4">
        {/* Sección VIP (más cerca del escenario) */}
        <div
          className={`
            h-32 ${sections[0].color} ${sections[0].hoverColor}
            ${
              selectedSeats?.id === sections[0].id
                ? "ring-4 ring-yellow-400"
                : ""
            }
            rounded-lg cursor-pointer transition-all
            flex flex-col items-center justify-center text-white
            transform hover:scale-[1.02]
          `}
          onClick={() => handleSectionClick(sections[0])}
        >
          <h3 className="text-2xl font-bold">{sections[0].name}</h3>
          <p className="text-lg">${sections[0].price}</p>
        </div>

        {/* Sección Preferencial (medio) */}
        <div
          className={`
            h-40 ${sections[1].color} ${sections[1].hoverColor}
            ${
              selectedSeats?.id === sections[1].id
                ? "ring-4 ring-yellow-400"
                : ""
            }
            rounded-lg cursor-pointer transition-all
            flex flex-col items-center justify-center text-white
            transform hover:scale-[1.02]
          `}
          onClick={() => handleSectionClick(sections[1])}
        >
          <h3 className="text-2xl font-bold">{sections[1].name}</h3>
          <p className="text-lg">${sections[1].price}</p>
        </div>

        {/* Sección General (más lejos del escenario) */}
        <div
          className={`
            h-48 ${sections[2].color} ${sections[2].hoverColor}
            ${
              selectedSeats?.id === sections[2].id
                ? "ring-4 ring-yellow-400"
                : ""
            }
            rounded-lg cursor-pointer transition-all
            flex flex-col items-center justify-center text-white
            transform hover:scale-[1.02]
          `}
          onClick={() => handleSectionClick(sections[2])}
        >
          <h3 className="text-2xl font-bold">{sections[2].name}</h3>
          <p className="text-lg">${sections[2].price}</p>
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow">
        <h4 className="font-bold mb-4 text-gray-700">
          Información de secciones:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.map((section) => (
            <div key={section.id} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded ${section.color}`}></div>
              <div>
                <p className="font-semibold">{section.name}</p>
                <p className="text-sm text-gray-600">
                  Capacidad: {section.capacity} personas
                </p>
                <p className="text-sm font-medium text-cyan-600">
                  ${section.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VenueMap;
