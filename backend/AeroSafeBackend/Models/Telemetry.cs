using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AeroSafeBackend.Models
{
    public class Telemetry
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid FlightId { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // Sample telemetry fields
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Altitude { get; set; }      // meters
        public double SpeedKts { get; set; }      // knots
        public double FuelPercent { get; set; }   // 0-100
        public double EngineTempC { get; set; }   // degrees Celsius
    }
}
