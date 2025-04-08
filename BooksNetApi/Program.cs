using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=Database/books.sqlite")
);
builder.Services.AddAuthorization();
builder.Services
    .AddIdentityApiEndpoints<AppIdentityUser>(opt =>
    {
        opt.SignIn.RequireConfirmedEmail = false;
        opt.Password.RequireNonAlphanumeric = false;
        opt.Password.RequireLowercase = false;
        opt.Password.RequireUppercase = false;
        opt.Password.RequiredLength = 3;
    })
    .AddEntityFrameworkStores<AppDbContext>();

var corsPolicyName = "CorsPolicyAllowLocalhost";
builder.Services.AddCors(opt =>
{
    opt.AddPolicy(name: corsPolicyName, policy =>
    {
        // policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// app.UseHttpsRedirection();

app.MapIdentityApi<AppIdentityUser>();

app.UseHttpLogging();
app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(opt =>
        opt.SwaggerEndpoint("../openapi/v1.json", "Swagger UI")
    );
}

app.Run();
