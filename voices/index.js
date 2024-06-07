const ffmpeg = require("fluent-ffmpeg");
const https = require("https");
const http = require("http");
const fs = require("fs");
ffmpeg.setFfmpegPath(require("@ffmpeg-installer/ffmpeg").path);

module.exports = {
  generateSpeech(voice, text) {
    return new Promise(async (res, rej) => {
      let oldmethod = JSON.parse(fs.readFileSync("./static/old.json"));
      let vmoldmethod = JSON.parse(fs.readFileSync("./static/old_vm.json"));
      let lowertext = text.toLowerCase();
      let modifiedText;
      if (lowertext.includes("aaaaa") && (!oldmethod.includes(voice) && !vmoldmethod.includes(voice))) {
        let inputText = lowertext;
        let pattern = /(?:gr|[abcdefhijkklmnopqrstuvzxgwy])aa+([bcdefgijklmnopqrstuvwxzhy]?)/g;
        let exclimation = /!/g;
        let question = /\?/g;
        let isscream = false;
        let match = inputText.match(pattern);
        console.log(match);
        for (let i = 0; i < match.length; i++) {
          let voiceValues = ["aa"];
          if (match[i].charAt(0) == "y") {
            voiceValues.unshift("a")
            voiceValues.unshift("j")
          }
          else if (match[i].toLowerCase().charAt(0) == "w") {
            if (voice != "Dallas") {
              voiceValues.unshift("w1")
            }
            else {
              voiceValues.unshift("w")
            }
          }
          else if (match[i].toLowerCase().charAt(0) == "a") {
            voiceValues.pop();
            voiceValues.unshift("a1")
            voiceValues.unshift("ah")
          }
          else if (match[i].toLowerCase().charAt(0) == "r") {
            voiceValues.unshift("r")
          }
          else if (match[i].toLowerCase().charAt(0) == "b") {
            voiceValues.unshift("b")
          }
          else if (match[i].toLowerCase().charAt(0) == "c") {
            voiceValues.unshift("k")
          }
          else if (match[i].toLowerCase().charAt(0) == "d") {
            voiceValues.unshift("d")
          }
          else if (match[i].toLowerCase().charAt(0) == "e") {
            voiceValues.unshift("e")
          }
          else if (match[i].toLowerCase().charAt(0) == "f") {
            voiceValues.unshift("f")
          }
          else if (match[i].toLowerCase().charAt(0) == "h") {
            voiceValues.unshift("h")
          }
          else if (match[i].toLowerCase().charAt(0) == "i") {
            voiceValues.unshift("i")
          }
          else if (match[i].toLowerCase().charAt(0) == "j") {
            voiceValues.unshift("jh")
          }
          else if (match[i].toLowerCase().charAt(0) == "k") {
            voiceValues.unshift("k")
          }
          else if (match[i].toLowerCase().charAt(0) == "k") {
            voiceValues.unshift("k")
          }
          else if (match[i].toLowerCase().charAt(0) == "l") {
            voiceValues.unshift("l")
          }
          else if (match[i].toLowerCase().charAt(0) == "m") {
            voiceValues.unshift("m")
          }
          else if (match[i].toLowerCase().charAt(0) == "n") {
            voiceValues.unshift("n")
          }
          else if (match[i].toLowerCase().charAt(0) == "o") {
            voiceValues.unshift("o")
          }
          else if (match[i].toLowerCase().charAt(0) == "p") {
            voiceValues.unshift("p")
          }
          else if (match[i].toLowerCase().charAt(0) == "q") {
            voiceValues.unshift("q")
          }
          else if (match[i].toLowerCase().charAt(0) == "s") {
            voiceValues.unshift("s")
          }
          else if (match[i].toLowerCase().charAt(0) == "t") {
            voiceValues.unshift("t")
          }
          else if (match[i].toLowerCase().charAt(0) == "u") {
            voiceValues.unshift("uh1")
          }
          else if (match[i].toLowerCase().charAt(0) == "v") {
            voiceValues.unshift("v1")
          }
          else if (match[i].toLowerCase().charAt(0) == "x") {
            voiceValues.unshift("eh1")
            voiceValues.unshift("z")
          }
          else if (match[i].toLowerCase().charAt(0) == "z") {
            voiceValues.unshift("aa1")
            voiceValues.unshift("z")
          }
          else if (match[i].includes("gr")) {
            if (voice == "French-fry") {
              voiceValues.pop();
              voiceValues.unshift("r")
              voiceValues.unshift("g1")
            }
            else {
              voiceValues.pop();
              voiceValues.unshift("r");
              voiceValues.unshift("g");
            }
          }
          else if (match[i].includes("ga")) {
            voiceValues.unshift("g1");
          }
          let consecutiveAs = match[i].length - 1;
          for (let i = 0; i < consecutiveAs; i++) {
            voiceValues.push("ah");
          }
          if (!match[i].includes("ah") && match[i].charAt(0) != "a" && !match[i].includes("ay")) {
            if (voice == "Kayla" || voice == "Tophat" || voice == "Designer" || voice == "JerseyGirl" || voice == "Susan" || voice == "Kevin" || voice == "TopHat" || voice == "Jerkface" || voice == "French-fry" || voice == "Evilgenius" || voice == "Frank" || voice == "Vlad" || voice == "Warren" || voice == "Tamika" || voice == "Vixen" || voice == "Charlie" || voice == "Belle" || voice == "Duchess") {
              voiceValues.push("aa1");
              voiceValues.push("a");
            }
            else if (voice == "Wiseguy" || voice == "Conrad") {
              voiceValues.push("aa1");
              voiceValues.push("aa1");
            }
            else if (voice == "Kidaroo") {
              voiceValues.push("aa");
              voiceValues.push("ah");
            }
            else if (voice == "Zach") {
              voiceValues.push("aa1");
              voiceValues.push("aa");
            }
            else if (voice == "RansomNote") {
              voiceValues.push("aa");
              voiceValues.push("aa");
              voiceValues.push("ay");
            }
            else if (voice == "Gregory") {
              voiceValues.push("a1");
              voiceValues.push("aa");
            }
            else if (voice == "Princess" || voice == "Diesel") {
              voiceValues.push("aa1");
              voiceValues.push("a");
            }
            else if (voice == "Dallas") {
              voiceValues.push("ah1");
            }
            else {
              voiceValues.push("ah");
              voiceValues.push("a");
            }
            if (match[i] == "h") {
              if (voice == "RansomNote") {
                voiceValues.pop();
                voiceValues.pop();
                voiceValues.pop();
              }
              else {
                voiceValues.pop();
                voiceValues.pop();
              }
              voiceValues.push("aa1");
              if (voice == "Dallas") {
                voiceValues.pop();
              }
            }
          }
            else if (match[i].includes("ay")) {
              voiceValues.push("ey1");
              voiceValues.push("ey1");
            }
          //Ah code (for owen)
          else if (match[i].includes("ah")) {
            if (voice == "Kayla" || voice == "Frank") {
              voiceValues.push("ah1");
              voiceValues.push("a");
              voiceValues.push("ah");
            }
            else if (voice == "Belle") {
              voiceValues.push("aa1");
              voiceValues.push("ah");
            }
            else if (voice == "Designer") {
              voiceValues.push("ah");
              voiceValues.push("a");
              voiceValues.push("ah");
            }
            else {
              voiceValues.push("aa");
              voiceValues.push("ah");
            }
          }
          else {
            isscream = true;
          }
          if (!isscream) {
            let xmlText = `<phoneme ph="${voiceValues.join(" ")}">Cepstral</phoneme>`;
            modifiedText = !modifiedText ? inputText.replace(match[i], xmlText) : modifiedText.replace(match[i], xmlText);
            let modifiedExclimation;
            let modifiedPeriod; // why does the ! have the period code

            modifiedExclimation = modifiedText.replace(exclimation, "! ,");
            modifiedQuestion = modifiedExclimation.replace(question, "? ,");
            modifiedComma = modifiedQuestion.replace(/,/g, ", ;");
            modifiedPeriod = modifiedComma.replace(/\./g, ". ,");
            console.log(modifiedQuestion);
            text = modifiedQuestion;
          }
        }
      }
      let fakeEmail = [];
      for (let c = 0; c < 15; c++) fakeEmail.push(~~(65 + Math.random() * 26));
      const email = `${String.fromCharCode.apply(null, fakeEmail)}@gmail.com`;
      const q = new URLSearchParams({
        msg: text,
        voice: voice,
        email
      }).toString();
      if (!oldmethod.includes(voice) && !vmoldmethod.includes(voice)) {
        http.get({
          hostname: `api.voiceforge.com`,
          path: `/swift_engine?${q}`,
          port: 80,
          headers: {
            'User-Agent': 'just_audio/2.7.0 (Linux;Android 11) ExoPlayerLib/2.15.0',
            'HTTP_X_API_KEY': '8b3f76a8539',
            'Accept-Encoding': 'identity',
            'Icy-Metadata': '1'
          }
        }, (r) => {
          let buffers = [];
          r
            .on("data", (b) => buffers.push(b))
            .on("end", () => res(Buffer.concat(buffers)))
            .on("error", rej);
        }).on("error", rej);
      }
      else {
        const hostname = !vmoldmethod.includes(voice) ? `davidescobariscool.loophole.site` : `davidescobariscool.loophole.site`;
        const req = https.get(`https://${hostname}/say?v=${voice}&text=${encodeURIComponent(text)}`, (r) => {
            let buffers = [];
            r.on("data", (b) => buffers.push(b));
            r.on("end", () => res(Buffer.concat(buffers)));
        }).on("error", (e) => console.error(e));
      }
    });
  }
}