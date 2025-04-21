using System.ComponentModel.DataAnnotations;

namespace RealTimeTranslator.API.Models.TranslationModels
{
    public class TextTranslationRequest
    {
        [Required]
        public string Text { get; set; } = string.Empty;

        [Required]
        public string FromLanguage { get; set; } = "pt-BR";

        [Required]
        public string ToLanguage { get; set; } = "en-US";
    }
}
