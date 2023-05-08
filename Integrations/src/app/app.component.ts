import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Messages } from './classes/messages';
import { AudioConfig, SpeechConfig, SpeechSynthesizer, SpeechRecognizer, AudioOutputStream, SpeechSynthesisResult, ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import { saveAs } from 'file-saver';
import { arrayBuffer } from 'stream/consumers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

  title = 'Integrations';
  requests: string[] = new Array;
  messages: Messages[] = new Array;
  messageInside: Messages = new Messages;
  reply:string;
  requestBackUp: string;

  // private speechConfig: SpeechConfig;
  // private synthesizer: SpeechSynthesizer;

  constructor(private http: HttpClient){

  }
  async getdata(request:string){
    //When response was get messages should be visible
    [].forEach.call(document.querySelectorAll('.show'), function (el: HTMLElement) {
      el.style.visibility = 'visible';
    })

    //Speech to text filling request to request message
    this.requestBackUp = request;
    
    this.reply = await this.http.get(`https://localhost:44372/api/Integrations/Sender?request=${request}`,{responseType: 'text'}).toPromise() as string
    window.scrollTo(0, document.body.scrollHeight);

    //Mesaj yazilandan sonra inputun icinin bosalmasi
    let inputVall = document.querySelector('input')! ;
    inputVall.value=""

    //Filling question and reply to messages object
    this.messages.push({from: request, me: this.reply}) 
  }
  ngOnInit() {
    //When page is starting, the messages section should be hidden
    [].forEach.call(document.querySelectorAll('.show'), function (el: HTMLElement) {
      el.style.visibility = 'hidden';
    })
  }

  public textToSpeech(): void{
    //Text to speech
    this.convertTextToSpeech(this.reply)
}
async convertTextToSpeech(text:string){
  const speechConfig = SpeechConfig.fromSubscription('f9778c8be7254bdb97d461c84cfefffa', 'eastus');
  speechConfig.speechSynthesisVoiceName = "az-AZ-BanuNeural";
  const synthesizer  :SpeechSynthesizer = new SpeechSynthesizer(speechConfig);
  const ret = await synthesizer.speakTextAsync(text);
  
  //Installing speech to audio file
  // const blob = new Blob([], { type: 'audio/mpeg' });
  // saveAs(blob, 'output.mp3');
  
  return ret;
}
  speechToText(){
    const speechConfig = SpeechConfig.fromSubscription('f9778c8be7254bdb97d461c84cfefffa', 'eastus');
    speechConfig.speechSynthesisVoiceName = "az-AZ-BabekNeural";
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const recognizer  = new SpeechRecognizer(speechConfig, audioConfig);
    recognizer.recognizeOnceAsync(result=> {
      console.log(`Transcription: ${result.text}`);
      this.requestBackUp = result.text
    });
  }
}

