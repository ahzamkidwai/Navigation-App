export default function useVoiceInput() {
  const startVoiceInput = (setter) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      setter(event.results[0][0].transcript);
    };

    recognition.onerror = (err) => {
      console.error("Speech error:", err);
    };
  };

  return { startVoiceInput };
}
