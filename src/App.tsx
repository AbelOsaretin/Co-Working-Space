import React, { useState } from "react";
import "./App.css";

interface Desk {
  id: number;
  type: "individual" | "team";
  isBooked: boolean;
}

const App = () => {
  const [desks, setDesks] = useState<Desk[]>(
    Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      type: i < 10 ? "individual" : "team",
      isBooked: false,
    }))
  );

  const [selectedDesk, setSelectedDesk] = useState<number | null>(null);
  const [tier, setTier] = useState<"Basic" | "Premium" | "Executive">("Basic");
  const [hours, setHours] = useState<number>(1);
  const [totalCharge, setTotalCharge] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const calculatePrice = () => {
    if (selectedDesk === null) return;

    const desk = desks.find((d) => d.id === selectedDesk);
    let rate = 0;

    if (desk?.type === "team") {
      rate = 25; // Fixed team rate [cite: 20]
    } else {
      // Rates based on membership tiers [cite: 19]
      const rates = { Basic: 10, Premium: 15, Executive: 20 };
      rate = rates[tier];
    }

    let total = rate * hours;
    // 10% discount for more than 3 hours [cite: 22]
    if (hours > 3) {
      total *= 0.9;
    }

    setTotalCharge(total);

    // Mark desk as booked
    setDesks(
      desks.map((d) => (d.id === selectedDesk ? { ...d, isBooked: true } : d))
    );
    setSelectedDesk(null);
    setError("");
  };

  const handleDeskClick = (desk: Desk) => {
    if (desk.isBooked) {
      setError("This desk is already booked!"); // Prevents double booking
      return;
    }
    setSelectedDesk(desk.id);
    setError("");
  };

  return (
    <div className="container">
      <h1>Co-working Space Booking</h1>

      <div className="grid">
        {desks.map((desk) => (
          <div
            key={desk.id}
            className={`desk ${desk.type} ${desk.isBooked ? "booked" : ""} ${
              selectedDesk === desk.id ? "selected" : ""
            }`}
            onClick={() => handleDeskClick(desk)}
          >
            {desk.type === "individual" ? "Indiv." : "Team"} #{desk.id}
          </div>
        ))}
      </div>

      {selectedDesk && (
        <div className="booking-panel">
          <h3>Booking Desk #{selectedDesk}</h3>
          {desks.find((d) => d.id === selectedDesk)?.type === "individual" && (
            <select
              id="membership-tier"
              onChange={(e) => setTier(e.target.value as any)}
            >
              <option value="Basic">Basic ($10/hr)</option>
              <option value="Premium">Premium ($15/hr)</option>
              <option value="Executive">Executive ($20/hr)</option>
            </select>
          )}
          <input
            type="number"
            id="booking-duration"
            min="1"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />
          <button id="book-button" onClick={calculatePrice}>
            Confirm Booking
          </button>
        </div>
      )}

      {error && (
        <p id="error-message" style={{ color: "red" }}>
          {error}
        </p>
      )}
      {totalCharge !== null && (
        <h2 id="total-charge">Total Charged: ${totalCharge.toFixed(2)}</h2>
      )}
    </div>
  );
};

export default App;
