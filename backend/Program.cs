
using Microsoft.EntityFrameworkCore;
using HotChocolate;
using HotChocolate.AspNetCore;
using OnThisDay.Api.Domain.Repositories;
using OnThisDay.Api.Infrastructure.Repositories;
using OnThisDay.Api.Infrastructure.Data;
using OnThisDay.Api.Application.Services;
using OnThisDay.Api.Presentation.Admin.Resolvers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
//Database
builder.Services.AddDbContext<OnThisDayDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("OnThisDayDb"));
});
//repositories:
builder.Services.AddScoped<ISportRepository, SportRepository>();
builder.Services.AddScoped<ISportEventRepository, SportEventRepository>();
builder.Services.AddScoped<ISportEventService , SportEventService>();

//Graphql 
builder.Services
    .AddGraphQLServer()
    .AddMutationType<SportEventMutation>();


var app = builder.Build();
app.UseCors("Frontend");
app.MapGraphQL("/graphql");

app.Run();
