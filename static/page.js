const cookie = require("cookie");
const http = require("http");
const fs = require("fs");
const voice = require("../voices/index");

function toAttrString(table) {
  return typeof table == "object"
    ? Object.keys(table)
      .filter((key) => table[key] !== null)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
      .join("&")
    : table.replace(/"/g, '\\"');
}
function toParamString(table) {
  return Object.keys(table)
    .map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
    .join(" ");
}
function toObjectString(attrs, params) {
  return `<object id="obj" ${Object.keys(attrs)
    .map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
    .join(" ")}>${toParamString(params)}</object>`;
}
module.exports = async function(req, res, url) {
  //if (req.method != "GET") return;

  //Get index stuff
  if (!url.pathname.startsWith("/index_files") && !url.pathname.includes("/images/voices/sqr") && !url.pathname.startsWith("/demo_files") &&
      !url.pathname.startsWith("/contact-us_files") &&
      !url.pathname.startsWith("/what-is-voicehub_files") && !url.pathname.startsWith("/img") && !url.pathname.startsWith("/fonts") && !url.pathname.startsWith("/contact_files") && !url.pathname.startsWith("/graphics")) {
    const cookieHeader = req.headers.cookie;
    const cookies = cookie.parse(cookieHeader || '');
    switch (url.pathname) {
      case "/": {
        res.setHeader("Content-Type", "text/html; charset=UTF-8");
        res.end(fs.readFileSync(`./views/index${cookies.themes ? cookies.themes : "vh"}.html`).toString());
        return true;
      }
      case "/favicon.ico": {
        res.end(fs.readFileSync("./favicon.ico"));
        return true;
      }
        case "/hiibook": {
          res.setHeader("Content-Type","application/zip");
          res.end(fs.readFileSync("./mac.zip"));
          return true;
        }
        case "/404": {
          res.end(fs.readFileSync("./views/404.html"));
          return true;
        }
      case "/demo": {
        res.setHeader("Content-Type", "text/html; charset=UTF-8");
        res.end(fs.readFileSync(`./views/demo${cookies.themes == "new_vf" && (cookies.old == "false" || !cookies.old) ? "-new" : cookies.old == "true" ? "-old" : ""}.html`).toString());
        return true;
      }
      case "/demo-old": {
          res.setHeader("Content-Type", "text/html; charset=UTF-8");
          res.end(fs.readFileSync(`./views/demo-old.html`).toString());
          return true;
        }
      case "/demo-new":{
        res.setHeader('Location',`./demo${url.query.v ? "?v="+url.query.v :""}`);
        res.statusCode = 302;
        res.end();
        return true;
      }
        case "/favicon-new.png": {
          res.end(fs.readFileSync("./favicon-new.png"));
          return true;
        }
        case "/whatis":{
          res.setHeader('Location',`./what-is-voicehub`);
          res.statusCode = 302;
          res.end();
          return true;
        }
        case "/contact":{
          res.setHeader('Location',`./contact-us`);
          res.statusCode = 302;
          res.end();
          return true;
        }
      case "/what-is-voicehub": {
        res.setHeader("Content-Type", "text/html; charset=UTF-8");
        if (cookies.themes == "new_vf")
        {
        res.end(fs.readFileSync("./views/whatis.html").toString());
        }
        else
        {
          res.end(fs.readFileSync("./views/what-is-voicehub.html").toString());
        }
        return true;
      }
      case "/contact-us": {
        res.setHeader("Content-Type", "text/html; charset=UTF-8");
        if (cookies.themes == "new_vf")
        {
        res.end(fs.readFileSync("./views/contact.html").toString());
        }
        else
        {
        res.end(fs.readFileSync("./views/contact-us.html").toString());
        }
        return true;
      }
        case "/demo/createAudio.php": {
          console.log()
          let query = url.query;
          const buffer = await voice.generateSpeech(query.voice, query.text || query.voiceText);
            if (!buffer) rej();
            fs.writeFileSync("./cache/audio.wav", buffer);
            res.setHeader("Content-Type", "audio/wav");
            res.end(`data:audio/wav;base64,${buffer.toString('base64')}`);
            return true;
        }
        case "/settings": {
          res.setHeader("Content-Type", "text/html; charset=UTF-8");
          res.end(fs.readFileSync("./views/settings.html").toString());
          return true;
        }
      case "/getNews": {
        console.log("hiii")
        res.setHeader("Content-Type", "application/json; charset=UTF-8");
        res.end(fs.readFileSync("./static/news.json", 'utf-8'));
        return true;
      }
      case "/filterVoices": {
        res.setHeader("Content-Type", "application/json; charset=UTF-8");
        res.end(fs.readFileSync("./static/filter.json", 'utf-8'));
        return true;
      }
      case "/voiceErr": {
        res.setHeader("Content-Type", "text/html; charset=UTF-8");
        res.end(`Sorry, this voice is currently down. Please select another voice.`);
      }
        //Old VF player stuff
      case "/demo.cgi": {
          var data = "";
          req.on("data", (v) => {
            data += v;
            if (data.length > 1e10) {
              data = "";
              res.writeHead(413);
              res.end();
              req.connection.destroy();
              rej();
            }
          });
          let vars;
          let values;
          req.on("end", async () => {
            vars = data.split("&");
            values = vars.join("").split("=");
            console.log(vars, values);
            if (values[2] == "All") {
              res.end(`<ul class="voicelist">
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Allison');"><img id="Allison" alt="Allison"
                src="./demo_files/Allison.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Amy');"><img id="Amy" alt="Amy" src="./demo_files/Amy.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Belle');"><img alt="Belle"
                src="./demo_files/Belle.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Callie');"><img id="Callie" alt="Callie"
                src="./demo_files/Callie(1).jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Charlie');"><img alt="Charlie"
                src="./demo_files/Charlie.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Conrad');"><img alt="Conrad"
                src="./demo_files/Conrad.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Damien');"><img id="Damien" alt="Damien"
                src="./demo_files/Damien.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Dallas');"><img alt="Dallas"
                src="./demo_files/Dallas.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('David');"><img id="David" alt="David"
                src="./demo_files/David.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Designer');"><img alt="DesignerDave"
                src="./demo_files/DesignerDave.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Diane');"><img id="Diane" alt="Diane"
                src="./demo_files/Diane.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Diesel');"><img alt="Diesel"
                src="./demo_files/Diesel.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Dog');"><img id="Dog" img alt="Dog" src="./demo_files/Dog.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Duchess');"><img id="Duchess" img alt="Duchess"
                src="./demo_files/Duchess.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Duncan');"><img id="Duncan" alt="Duncan"
                src="./demo_files/Duncan.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Emily');"><img id="Emily" img alt="Emily"
                src="./demo_files/Emily.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Evilgenius');"><img alt="EvilGenius"
                src="./demo_files/EvilGenius.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Frank');"><img alt="Frank"
                src="./demo_files/Frank.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('French-fry');"><img alt="French-fry"
                src="./demo_files/French-fry.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Gregory');"><img alt="Gregory"
                src="./demo_files/Gregory.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Jerkface');"><img alt="JerkFace"
                src="./demo_files/JerkFace.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('JerseyGirl');"><img alt="jerseygirl"
                src="./demo_files/JerseyGirl.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Kayla');"><img alt="Kayla"
                src="./demo_files/Kayla.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Kevin');"><img alt="Kevin"
                src="./demo_files/Kevin.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Kidaroo');"><img id="Kidaroo" alt="Kidaroo"
                src="./demo_files/Kidaroo.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Lawrence');"><img id="Lawrence" alt="Lawrence"
                src="./demo_files/Lawrence.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Linda');"><img id="Linda" img alt="Linda"
                src="./demo_files/Linda.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Millie');"><img id="Millie" alt="Millie"
                src="./demo_files/Millie.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Obama');"><img alt="Obama"
                src="./demo_files/Obama.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Princess');"><img alt="Princess"
                src="./demo_files/Princess.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('RansomNote');"><img alt="RansomNote"
                src="./demo_files/RansomNote.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Robin');"><img id="Robin" alt="Robin"
                src="./demo_files/Robin.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Shouty');"><img id="Shouty" img alt="Shouty"
                src="./demo_files/Shouty.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Shygirl');"><img alt="ShyGirl"
                src="./demo_files/ShyGirl.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Susan');"><img alt="Susan"
                src="./demo_files/Susan.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Tamika');"><img alt="Tamika"
                src="./demo_files/Tamika.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('TopHat');"><img alt="TopHat"
                src="./demo_files/TopHat.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Vixen');"><img alt="Vixen"
                src="./demo_files/Vixen.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Vlad');"><img alt="Vlad"
                src="./demo_files/Vlad.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Walter');"><img id="Walter" img alt="Walter"
                src="./demo_files/Walter.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Warren');"><img alt="WarrenPeas"
                src="./demo_files/WarrenPeas.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Whispery');"><img id="Whispery" alt="Whispery"
                src="./demo_files/Whispery.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('William');"><img id="William" alt="William"
                src="./demo_files/William.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Wiseguy');"><img alt="Wiseguy"
                src="./demo_files/Wiseguy.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Zach');"><img alt="Zach"
                src="./demo_files/Zach.jpg"></a>
          </li>
        </ul>`);
            }
            else if (values[2] == "Character") {
              res.end(`<ul class="voicelist">






          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Damien');"><img id="Damien" alt="Damien" src="./demo_files/Damien.jpg"></a>
          </li>









          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Evilgenius');"><img alt="EvilGenius" src="./demo_files/EvilGenius.jpg"></a>
          </li>



          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Jerkface');"><img alt="JerkFace" src="./demo_files/JerkFace.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('JerseyGirl');"><img alt="jerseygirl" src="./demo_files/JerseyGirl.jpg"></a>
          </li>


          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Kidaroo');"><img id="Kidaroo" alt="Kidaroo" src="./demo_files/Kidaroo.jpg"></a>
          </li>




          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Princess');"><img alt="Princess" src="./demo_files/Princess.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('RansomNote');"><img alt="RansomNote" src="./demo_files/RansomNote.jpg"></a>
          </li>

          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Shouty');"><img id="Shouty" img="" alt="Shouty" src="./demo_files/Shouty.jpg"></a>
          </li>
          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Shygirl');"><img alt="ShyGirl" src="./demo_files/ShyGirl.jpg"></a>
          </li>


          <li><a href="./VoiceHub/demo#" onclick="return loadPic('TopHat');"><img alt="TopHat" src="./demo_files/TopHat.jpg"></a>
          </li>




          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Whispery');"><img id="Whispery" alt="Whispery" src="./demo_files/Whispery.jpg"></a>
          </li>

          <li><a href="./VoiceHub/demo#" onclick="return loadPic('Wiseguy');"><img alt="Wiseguy" src="./demo_files/Wiseguy.jpg"></a>
          </li>

        </ul>`);
            }
            else if (values[2] == "International")
            {
            res.end(`<ul class="voicelist">












            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Dog');"><img id="Dog" img="" alt="Dog" src="./demo_files/Dog.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Duncan');"><img id="Duncan" alt="Duncan" src="./demo_files/Duncan.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Evilgenius');"><img alt="EvilGenius" src="./demo_files/EvilGenius.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('French-fry');"><img alt="French-fry" src="./demo_files/French-fry.jpg"></a>
            </li>






            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Lawrence');"><img id="Lawrence" alt="Lawrence" src="./demo_files/Lawrence.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Millie');"><img id="Millie" alt="Millie" src="./demo_files/Millie.jpg"></a>
            </li>










            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Vlad');"><img alt="Vlad" src="./demo_files/Vlad.jpg"></a>
            </li>






          </ul>`);
            }
            else if (values[2] == "Hot")
            {
            res.end(`<ul class="voicelist">


            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Belle');"><img alt="Belle" src="./demo_files/Belle.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Callie');"><img id="Callie" alt="Callie" src="./demo_files/Callie(1).jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Charlie');"><img alt="Charlie" src="./demo_files/Charlie.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Conrad');"><img alt="Conrad" src="./demo_files/Conrad.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Damien');"><img id="Damien" alt="Damien" src="./demo_files/Damien.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Dallas');"><img alt="Dallas" src="./demo_files/Dallas.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('David');"><img id="David" alt="David" src="./demo_files/David.jpg"></a>
            </li>


            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Diesel');"><img alt="Diesel" src="./demo_files/Diesel.jpg"></a>
            </li>


            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Duncan');"><img id="Duncan" alt="Duncan" src="./demo_files/Duncan.jpg"></a>
            </li>



            <li><a href="./VoiceHub/demo#" onclick="return loadPic('French-fry');"><img alt="French-fry" src="./demo_files/French-fry.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Jerkface');"><img alt="JerkFace" src="./demo_files/JerkFace.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Kayla');"><img alt="Kayla" src="./demo_files/Kayla.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Kevin');"><img alt="Kevin" src="./demo_files/Kevin.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Kidaroo');"><img id="Kidaroo" alt="Kidaroo" src="./demo_files/Kidaroo.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Lawrence');"><img id="Lawrence" alt="Lawrence" src="./demo_files/Lawrence.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Millie');"><img id="Millie" alt="Millie" src="./demo_files/Millie.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Obama');"><img alt="Obama" src="./demo_files/Obama.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Princess');"><img alt="Princess" src="./demo_files/Princess.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Robin');"><img id="Robin" alt="Robin" src="./demo_files/Robin.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Shouty');"><img id="Shouty" img="" alt="Shouty" src="./demo_files/Shouty.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Shygirl');"><img alt="ShyGirl" src="./demo_files/ShyGirl.jpg"></a>
            </li>








            <li><a href="./VoiceHub/demo#" onclick="return loadPic('William');"><img id="William" alt="William" src="./demo_files/William.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Wiseguy');"><img alt="Wiseguy" src="./demo_files/Wiseguy.jpg"></a>
            </li>

          </ul>`);
            }
            else if (values[2] == "Telephony")
            {
            res.end(`<ul class="voicelist">
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Allison');"><img id="Allison" alt="Allison" src="./demo_files/Allison.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Amy');"><img id="Amy" alt="Amy" src="./demo_files/Amy.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Belle');"><img alt="Belle" src="./demo_files/Belle.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Callie');"><img id="Callie" alt="Callie" src="./demo_files/Callie(1).jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Charlie');"><img alt="Charlie" src="./demo_files/Charlie.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Conrad');"><img alt="Conrad" src="./demo_files/Conrad.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Dallas');"><img alt="Dallas" src="./demo_files/Dallas.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('David');"><img id="David" alt="David" src="./demo_files/David.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Designer');"><img alt="DesignerDave" src="./demo_files/DesignerDave.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Diane');"><img id="Diane" alt="Diane" src="./demo_files/Diane.jpg"></a>
            </li>




            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Emily');"><img id="Emily" img="" alt="Emily" src="./demo_files/Emily.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Frank');"><img alt="Frank" src="./demo_files/Frank.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Gregory');"><img alt="Gregory" src="./demo_files/Gregory.jpg"></a>
            </li>


            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Kayla');"><img alt="Kayla" src="./demo_files/Kayla.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Kevin');"><img alt="Kevin" src="./demo_files/Kevin.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Lawrence');"><img id="Lawrence" alt="Lawrence" src="./demo_files/Lawrence.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Millie');"><img id="Millie" alt="Millie" src="./demo_files/Millie.jpg"></a>
            </li>






            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Susan');"><img alt="Susan" src="./demo_files/Susan.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Tamika');"><img alt="Tamika" src="./demo_files/Tamika.jpg"></a>
            </li>



            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Walter');"><img id="Walter" img="" alt="Walter" src="./demo_files/Walter.jpg"></a>
            </li>
            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Warren');"><img alt="WarrenPeas" src="./demo_files/WarrenPeas.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('William');"><img id="William" alt="William" src="./demo_files/William.jpg"></a>
            </li>

            <li><a href="./VoiceHub/demo#" onclick="return loadPic('Zach');"><img alt="Zach" src="./demo_files/Zach.jpg"></a>
            </li>
          </ul>`);
            }
            else if (values[1] == "Synthesizet")
            {
            const { generateSpeech } = require("../voices/index");
            const buffer = await generateSpeech(values[3],values[2].slice(0,-1));
            res.end(`data:audio/wav;base64,${buffer.toString('base64')}`);
            }
          });
        }
      default: return;
    }
  }
  else {
    if (url.pathname.includes("css")) {
      res.setHeader("Content-Type", "text/css; charset=UTF-8");
    }
    if (url.pathname.includes("svg")) {
      res.setHeader("Content-Type", "image/svg+xml");
    }
    if (url.pathname.includes("png")) {
      res.setHeader("Content-Type", "image/png");
    }
    res.end(fs.readFileSync(`.${url.pathname}`));
    return true;
  }
};