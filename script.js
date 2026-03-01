/* ================= CONFIG ================= */
const BIN_ID = "69a3a338d0ea881f40e37c08";
const API_KEY = "$2a$10$3CMfF/FfVV3w1S0s.g5ukONquoDg31UjcX97UPlLnx9FIg2m10CIa";
const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

/* ================= USER ================= */
let username=null;
let tempo=0;
let ativo=true;

window.addEventListener("DOMContentLoaded", async ()=>{

    const saved=localStorage.getItem("sonifero_nome");
    const popup=document.getElementById("namePopup");

    if(!saved){
        popup.style.display="flex";
    }else{
        username=saved;
        popup.style.display="none";
        iniciarSessao();
    }

    atualizarRankingGlobal();
    setInterval(atualizarRankingGlobal,5000);
});

function salvarNome(){
    const nome=document.getElementById("usernameInput").value.trim();
    if(nome.length<2) return;

    localStorage.setItem("sonifero_nome",nome);
    username=nome;
    document.getElementById("namePopup").style.display="none";
    iniciarSessao();
}

/* ================= BANCO ================= */

async function pegarDB(){
    const r=await fetch(URL,{headers:{ "X-Master-Key":API_KEY }});
    const d=await r.json();
    return d.record;
}

async function salvarDB(data){
    await fetch(URL,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            "X-Master-Key":API_KEY
        },
        body:JSON.stringify(data)
    });
}

/* ================= SESSÃO ================= */

async function iniciarSessao(){

    setInterval(async ()=>{
        if(!ativo) return;

        tempo++;
        const db=await pegarDB();

        if(!db.usuarios[username])
            db.usuarios[username]={tempo:0,online:true};

        db.usuarios[username].tempo++;
        db.usuarios[username].online=true;

        await salvarDB(db);
    },1000);
}

/* parar ao sair */
window.addEventListener("beforeunload",async ()=>{
    ativo=false;
    const db=await pegarDB();
    if(db.usuarios[username])
        db.usuarios[username].online=false;
    await salvarDB(db);
});

/* ================= RANKING GLOBAL ================= */

async function atualizarRankingGlobal(){

    const db=await pegarDB();
    const lista=Object.entries(db.usuarios)
        .sort((a,b)=>b[1].tempo-a[1].tempo)
        .slice(0,8);

    ranking.innerHTML="";

    lista.forEach(([nome,data])=>{
        const li=document.createElement("li");
        li.textContent=`${nome} — ${formatarTempo(data.tempo)} ${data.online?"●":""}`;
        ranking.appendChild(li);
    });
}

function formatarTempo(s){
    const m=Math.floor(s/60);
    const sec=s%60;
    return `${m}m ${sec}s`;
}