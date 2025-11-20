using System.ComponentModel.DataAnnotations;

namespace AeroSafeBackend.Models
{
    public class Flight
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string FlightNumber { get; set; } = "";

        public string AircraftId { get; set; } = "";

        public DateTime ScheduledDeparture { get; set; }
        public DateTime ScheduledArrival { get; set; }

        // optional metadata
        public string Status { get; set; } = "Scheduled";
    }
}
