function pegarID(url) {
    try {
        const u = new URL(url);

        if (u.hostname.includes("youtu.be"))
            return u.pathname.slice(1);

        if (u.searchParams.get("v"))
            return u.searchParams.get("v");

        if (u.pathname.includes("/shorts/"))
            return u.pathname.split("/shorts/")[1];

    } catch {
        return null;
    }
}

let historico=[];

async function pegarTitulo(id){
    try{
        const res=await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`);
        const data=await res.json();
        return data.title||"música desconhecida";
    }catch{
        return"música desconhecida";
    }
}

async function tocar(){
    const link=document.getElementById("link").value.trim();
    const id=pegarID(link);

    if(!id){alert("link inválido");return;}

    const embed=`https://www.youtube.com/embed/${id}?autoplay=1&loop=1&playlist=${id}`;
    document.getElementById("videoFrame").src=embed;

    /* thumbnail */
    document.getElementById("thumb").src=`https://img.youtube.com/vi/${id}/hqdefault.jpg`;

    const titulo=await pegarTitulo(id);
    document.getElementById("nomeMusica").textContent=titulo;
    document.getElementById("audioTitulo").textContent=titulo;

    historico.unshift(titulo);
    if(historico.length>5)historico.pop();
    document.getElementById("historicoLista").innerHTML=historico.map(m=>`<li>${m}</li>`).join("");

    /* sempre inicia no modo audio */
    const audio=document.getElementById("audioPlayer");
    const video=document.getElementById("videoBox");

    video.style.display="none";
    audio.style.display="flex";
    audio.classList.add("fadeIn");
}

/* mostrar vídeo com animação */
function mostrarVideo(){
    const audio = document.getElementById("audioPlayer");
    const video = document.getElementById("videoBox");

    audio.classList.remove("fadeIn");
    audio.classList.add("fadeOut");

    setTimeout(()=>{
        audio.style.display="none";

        video.style.display="block";
        video.classList.remove("fadeOut");
        video.classList.add("fadeIn");
    },300);
}

/* voltar pro áudio */
function ocultarVideo(){
    const audio = document.getElementById("audioPlayer");
    const video = document.getElementById("videoBox");

    video.classList.remove("fadeIn");
    video.classList.add("fadeOut");

    setTimeout(()=>{
        video.style.display="none";

        audio.style.display="flex";
        audio.classList.remove("fadeOut");
        audio.classList.add("fadeIn");
    },300);
}

/* frases */
const frases=[
"memória não desliga",
"noite sempre pensa demais",
"ninguém percebeu",
"eu só fiquei quieto",
"tudo ecoa depois",
"a mente não dorme",
"saudade sem nome",
"tempo lento demais"
];

function spawnFrase(){
    const el=document.createElement("div");
    el.className="frase";
    el.textContent=frases[Math.floor(Math.random()*frases.length)];

    el.style.top=Math.random()*100+"vh";
    el.style.animationDuration=(20+Math.random()*40)+"s";
    el.style.fontSize=(14+Math.random()*10)+"px";
    el.style.opacity=0.35+Math.random()*0.5;

    document.getElementById("frasesBg").appendChild(el);
    setTimeout(()=>el.remove(),60000);
}

setInterval(spawnFrase,1200);
