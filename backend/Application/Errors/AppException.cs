namespace OnThisDay.Api.Application.Errors;

public sealed class AppException : Exception
{
    public string Code { get; }

    public AppException(string message, string code) : base(message)
    {
        Code = code;
    }

}