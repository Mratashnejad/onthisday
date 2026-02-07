namespace OnThisDay.Api.Application.Errors;


public static class AppErrors
{
    public static AppException Unauthorized(string message = "Not authenticated") => new(message, "AUTH");
    public static AppException Forbidden(string message = "Forbidden") => new(message, "FORBIDDEN");
    public static AppException NotFound(string message = "Not found") => new(message, "NOT_FOUND");
    public static AppException Validation(string message) => new(message, "VALIDATION");
    public static AppException Config(string message) => new(message, "CONFIG");
}