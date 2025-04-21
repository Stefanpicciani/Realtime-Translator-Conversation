namespace RealTimeTranslator.API.Models.TranslationModels
{
    public class TranslationResult
    {
        public string OriginalText { get; set; } = string.Empty;
        public string TranslatedText { get; set; } = string.Empty;
        public string? TranslatedAudio { get; set; }
    }
}
