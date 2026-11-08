// Mpilo's 21st birthday invitation — event details
const eventDetails = {
  title: "Mpilo's 21st Birthday Celebration",
  start: new Date("2026-12-16T12:00:00+02:00"),
  end: new Date("2026-12-16T16:00:00+02:00"),
  venue: "Signature, Lagoon Dr, Umhlanga Rocks, uMhlanga, 4068"
};

const countdownNodes = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};
const caption = document.getElementById("countdown-caption");

function updateCountdown() {
  const remaining = eventDetails.start.getTime() - Date.now();
  if (remaining <= 0) {
    Object.values(countdownNodes).forEach(node => node.textContent = "00");
    caption.textContent = "It's time to celebrate Mpilo!";
    return;
  }
  const values = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000)
  };
  Object.entries(values).forEach(([key, value]) => {
    countdownNodes[key].textContent = key === "days" ? String(value).padStart(3, "0") : String(value).padStart(2, "0");
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Add-to-calendar: creates a downloadable .ics file in the visitor's browser.
function toICSDate(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
document.getElementById("calendar-link").addEventListener("click", event => {
  event.preventDefault();
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Mpilo21//Birthday Invitation//EN",
    "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:mpilo-21-${eventDetails.start.getTime()}@invitation`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(eventDetails.start)}`,
    `DTEND:${toICSDate(eventDetails.end)}`,
    `SUMMARY:${eventDetails.title}`,
    `LOCATION:${eventDetails.venue}`,
    "DESCRIPTION:Join us to celebrate Mpilo's 21st birthday!",
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = "mpilo-21st-birthday.ics";
  document.body.appendChild(link); link.click(); link.remove();
  URL.revokeObjectURL(url);
});

// RSVP opens WhatsApp with a pre-filled message addressed to the host.
document.getElementById("rsvp-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "").trim();
  const guests = form.get("guests");
  const attendance = form.get("attendance");
  if (!name) return;
  const message = [
    "Hello! My RSVP for Mpilo's 21st birthday:",
    `Name: ${name}`,
    `Guests: ${guests}`,
    `Attendance: ${attendance}`,
    "Date: 16 December 2026, 12:00 PM",
    "Venue: Signature, Umhlanga"
  ].join("\n");
  document.getElementById("form-status").textContent = "Opening WhatsApp with your RSVP details…";
  window.open(`https://wa.me/27635151849?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

// Native share sheet on supported phones; otherwise copy/share via WhatsApp.
document.getElementById("share-link").addEventListener("click", async event => {
  event.preventDefault();
  const shareData = {
    title: "Mpilo Turns 21",
    text: "You're invited to celebrate Mpilo's 21st birthday on 16 December 2026 at 12:00 PM at Signature, Umhlanga.",
    url: window.location.href
  };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch (error) { /* Share sheet dismissed. */ }
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`, "_blank", "noopener,noreferrer");
  }
});
