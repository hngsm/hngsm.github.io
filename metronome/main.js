'use strict';
import {patterns} from './patterns.js';

// グローバルに使用する
const context = new AudioContext();
let masterVolume = 0.33;

// 音色に関する共通パラメータ
const duration = 0.03; // クリック音の長さ

// 1つ音を出す
function playClick(time, freq, volume) {
    //console.log(`play ${time}, ${freq}, ${volume}`);
    const osc = context.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    const gain = context.createGain();
    gain.gain.value = volume * masterVolume;
    osc.connect(gain).connect(context.destination);
    osc.start(time);
    osc.stop(time + duration);
}

let patternDuration;
let sequence;
function compilePattern(pattern) {
    patternDuration = pattern.duration;
    const tempSequence = [];
    for (const tr of pattern.tracks) {
        const freq = tr.freq;
        const vol = tr.vol;
        for (const note of tr.notes) {
            tempSequence.push({time: note, freq, vol})
        }
    }
    tempSequence.sort((a, b) => {
        if (a.time > b.time) return 1;
        if (a.time < b.time) return -1;
        return 0;
    })
    return tempSequence; 
}

let tempo = 120; // BPM
function beatToSecond(beat) {
    return beat * 60 / tempo;
}


// 処理ループ
const interval = 20.0; // タイマー呼び出し間隔
const scheduleAheadTime = 0.1; // 1回のタイマーで先読みする時間(秒)
let timerID;

let sequenceIndex = 0;
let baseAudioTime = 0;
let prevBeat = 0;
function initScheduler() {
    sequenceIndex = 0;
    baseAudioTime = context.currentTime + 0.01;
    prevBeat = 0;
}
function scheduler() {
    let i = 0;
    for (;i<100;i++) {
        const note = sequence[sequenceIndex];
        const beatDelta = note.time >= prevBeat ?
                            note.time - prevBeat:
                            note.time - prevBeat + patternDuration;
        const audioTime = baseAudioTime + beatToSecond(beatDelta);
        //console.log(`sequenceIndex ${sequenceIndex}; note.time: ${note.time}`);
        //console.log(`audioTime ${audioTime}; cur: ${context.currentTime}`);
        if (note.time !== prevBeat) {
            prevBeat = note.time;
            baseAudioTime = audioTime;
        }
        if (audioTime >= context.currentTime + scheduleAheadTime) {
            break;
        }
        playClick(audioTime, note.freq, note.vol);
        sequenceIndex += 1;
        if (sequenceIndex >= sequence.length) {
            sequenceIndex = 0;
        }
    }
    if (i === 100) {
        window.alert("ERROR");
        return;
    }
    timerID = setTimeout(scheduler, interval);
}

function init() {
    const playButton = document.getElementById("playbutton");
    const tempoLabel = document.getElementById("tempolabel");
    const tempoSlider = document.getElementById("temposlider");
    let isPlaying = false;
    playButton.addEventListener("click", (ev) => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            if (context.state === 'suspended') {
                context.resume();
            }
            initScheduler();
            scheduler();
        } else {
            clearTimeout(timerID);
            ev.target.dataset.playing = "false";
        }
    });
    tempoSlider.addEventListener('input', (ev) => {
        tempoLabel.innerText = ev.target.value;
        tempo = ev.target.value;
    });
    tempoSlider.value = tempo;
    const masterVolumeLabel = document.getElementById("mastervolumelabel");
    const masterVolumeSlider = document.getElementById("mastervolumeslider");
    masterVolumeSlider.addEventListener('input', (ev) => {
        masterVolumeLabel.innerText = parseFloat(ev.target.value).toFixed(2);
        masterVolume = ev.target.value;
    })
    const patternJsonTextArea = document.getElementById("patternjson");
    const presetSelect = document.getElementById("presetselect");
    const loadPattern = (i) => {
        sequence = compilePattern(patterns[i]);
        patternJsonTextArea.value = JSON.stringify(patterns[i], null, "  ");
        initScheduler();
    } 
    presetSelect.addEventListener('change', (ev) => {
        const i = parseInt(ev.target.value);
        loadPattern(i);
    });
    const patternupdateButton = document.getElementById("patternupdate");
    const messageArea = document.getElementById("message");
    patternupdateButton.addEventListener("click", () => {
        try {
            messageArea.textContent = "";
            const newpattern = JSON.parse(patternJsonTextArea.value);
            sequence = compilePattern(newpattern);
            initScheduler();
        } catch (e) {
            if (e instanceof SyntaxError) {
                messageArea.textContent = e.toString();
            } else {
                throw e;
            }
        }
    });
    for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        const opt = new Option(pattern.title, i);
        presetSelect.options.add(opt);
    }
    loadPattern(0);
}
window.addEventListener("load", init);
