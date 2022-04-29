import { useState, useRef, useEffect } from 'react';
import { getSpeechRecognition } from '../utils';

export type OnResultCallback = (event: any) => void;
export type OnFinalCallback = (v: string) => void;
export type Options = {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
  onFinalCallback?: OnFinalCallback;
  onResultCallback?: OnResultCallback;
};
export type Methods = { start: () => void; end: () => void; reset: () => void };

export default function useSpeechRecognition(options: Options): [boolean, string, Methods, string] {
  const {
    maxAlternatives = undefined,
    continuous = true,
    interimResults = true,
    lang = undefined,
    onResultCallback,
    onFinalCallback,
  } = options;
  const [text, setText] = useState('');
  const [onceText, setOnceText] = useState('');
  const [open, setOpen] = useState(false);
  const speechRecognitionRef = useRef<any>(null);

  const init = () => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    if (!speechRecognitionRef.current) {
      speechRecognitionRef.current = new SpeechRecognition();

      speechRecognitionRef.current.maxAlternatives = maxAlternatives;
      speechRecognitionRef.current.continuous = continuous;
      speechRecognitionRef.current.interimResults = interimResults;
      speechRecognitionRef.current.lang = lang;
    }
  };

  const reset = () => {
    setText('');
    setOnceText('');
    setOpen(false);
  };

  const start = () => {
    speechRecognitionRef.current.start();
    setOpen(true);
  };

  const end = () => {
    speechRecognitionRef.current?.stop();
    setOnceText('');
    setOpen(false);
  };

  useEffect(() => {
    init();

    speechRecognitionRef.current?.addEventListener('result', (event: any) => {
      onResultCallback?.(event);
      try {
        const resultRecord = event.results.item(event.resultIndex);
        const { transcript = '' } = resultRecord.item(0);
        if (resultRecord.isFinal) {
          setText(text + transcript);
          setOnceText(transcript);
          onFinalCallback?.(transcript);
        }
      } catch (e) {
        console.error(`useSpeechRecognition`, e);
        setOpen(false);
        setText('');
      }
    });

    return () => {
      reset();
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
        speechRecognitionRef.current = null;
      }
    };
  }, [options]);

  return [
    open,
    onceText,
    {
      start,
      end,
      reset,
    },
    text,
  ];
}
