using System.ComponentModel.DataAnnotations;

namespace RealTimeTranslator.API.Models.TranslationModels
{
    public class TextToSpeechRequest
    {
        [Required]
        public string Text { get; set; } = string.Empty;

        [Required]
        public string Language { get; set; } = "en-US";

        public string? VoiceName { get; set; }
    }
}
