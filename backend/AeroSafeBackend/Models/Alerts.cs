using System.ComponentModel.DataAnnotations;

namespace AeroSafeBackend.Models
{
    public class Alert
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid FlightId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Severity { get; set; } = "Low"; // Low, Medium, High, Critical
        public string Type { get; set; } = "";         // e.g., "LowFuel", "EngineOverheat"
        public string Message { get; set; } = "";
        public bool Acknowledged { get; set; } = false;
    }
}
