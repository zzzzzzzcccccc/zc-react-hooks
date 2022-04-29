export default function getSpeechRecognition() {
  // @ts-ignore
  return window.webkitSpeechRecognition || window.SpeechRecognition;
}
