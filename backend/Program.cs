using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OnThisDay.Api.Domain.Repositories;
using OnThisDay.Api.Infrastructure.Data;
using OnThisDay.Api.Infrastructure.Repositories;

// Controllers  + JSON
var builder = WebApplication.CreateBuilder(args);
builder.Services
    .AddControllers()
    .AddJsonOptions(options=>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
    });
//Cors
builder.Services.AddCors(options =>{
    options.AddPolicy("Frontend", policy=>{
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });

});

builder.Services.AddDbContext<OnThisDayDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("OnThisDayDb"));
});

builder.Services.AddScoped<ISportRepository, SportRepository>();
builder.Services.AddScoped<ISportEventRepository, SportEventRepository>();

//swagger 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();

app.Run();

// databse


//JWT Config

// builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
// var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>() ?? new JwtSettings();
// var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret));
