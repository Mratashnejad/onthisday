using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;


namespace OnThisDay.Api.Domain.Utilities;

public static class SlugGenerator
{
    public static string Generate(string input , DateTime? date = null)
    {
        if (string.IsNullOrWhiteSpace(input))
            throw new ArgumentException("Slug source cannot be empty ", nameof(input) );

        var text = input.ToLowerInvariant();
        text = RemoveDiacritics(text);
        text = ConvertPersianDigitsToEnglish(text);


        text = Regex.Replace(text, @"[^a-z0-9\u0600-\u06FF\s-]", "");
        text = text.Trim('-');

        if(date.HasValue)
            text = $"{text}-{date:yyyy-MM-dd}";
        return text;
 
    }

    private static string RemoveDiacritics(string text)
    {
        var normalized = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder ();


        foreach (var c in normalized)
        {
            var category = Char.GetUnicodeCategory(c);
            if (category != UnicodeCategory.NonSpacingMark)
            sb.Append(c);
        }
        return sb.ToString().Normalize(NormalizationForm.FormC);
    }


    private static string ConvertPersianDigitsToEnglish(string text) => text
            .Replace('۰', '0')
            .Replace('۱', '1')
            .Replace('۲', '2')
            .Replace('۳', '3')
            .Replace('۴', '4')
            .Replace('۵', '5')
            .Replace('۶', '6')
            .Replace('۷', '7')
            .Replace('۸', '8')
            .Replace('۹', '9');
}