using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using AeroSafeBackend.Data;
using AeroSafeBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// Force Kestrel to listen on a fixed port
builder.WebHost.UseUrls("http://localhost:5121");

// ------------------------------------------------------
// Register Services
// ------------------------------------------------------

// Swagger + JWT UI Setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AeroSafe API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Enter: Bearer <your_jwt_token>",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Controllers
builder.Services.AddControllers().AddNewtonsoftJson();

// ------------------------------------------------------
// Database Configuration
// ------------------------------------------------------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AeroSafeDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));


// ------------------------------------------------------
// JWT Authentication
// ------------------------------------------------------
var jwtKey = builder.Configuration["Jwt:Key"] 
             ?? throw new InvalidOperationException("JWT Key not found.");

var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "AeroSafe";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "AeroSafe";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,

            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();


// ------------------------------------------------------
// CORS
// ------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});


// ------------------------------------------------------
// Register Your Services
// ------------------------------------------------------
builder.Services.AddScoped<IAuthService, AuthService>();


// ------------------------------------------------------
// Build App
// ------------------------------------------------------
var app = builder.Build();

// Swagger in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AeroSafe API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Redirect root → Swagger
app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();
