/* core.js — shared catalog logic for the viewer and all design previews.
   A design page defines window.onCatalog(data) (build/populate its controls) and
   window.paint(rows) (render cards), then includes this script LAST. Filters:
   Category, Difficulty, CTF (source_ctf). Paths are anchored to THIS file's URL,
   so it works whether included from web/ or web/designs/. */
(function(){
  var CORE = document.currentScript.src;         // .../web/core.js
  var WEB  = CORE.replace(/core\.js.*$/, "");     // .../web/
  var FIXED_CATS = ["Reverse Engineering","Mobile Security","Digital Forensics",
    "Web Application Security","Cryptography","Network Security","Secure Coding",
    "Exploitation","AI/ML"];
  var DORD = {easy:0, medium:1, hard:2};
  var esc = function(s){return String(s).replace(/[&<>"']/g,function(m){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m];});};

  function md(t){
    var lines=t.split("\n"), out=[], list=null;
    var inline=function(s){return esc(s).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>");};
    var cl=function(){ if(list){out.push(list==="ul"?"</ul>":"</ol>");list=null;} };
    lines.forEach(function(ln){
      var m;
      if(/^## /.test(ln)){cl();out.push("<h2>"+inline(ln.slice(3))+"</h2>");return;}
      if(/^### /.test(ln)){cl();out.push("<h3>"+inline(ln.slice(4))+"</h3>");return;}
      if(m=ln.match(/^\s*[-*]\s+(.*)/)){ if(list!=="ul"){cl();out.push("<ul>");list="ul";} out.push("<li>"+inline(m[1])+"</li>");return;}
      if(m=ln.match(/^\s*\d+\.\s+(.*)/)){ if(list!=="ol"){cl();out.push("<ol>");list="ol";} out.push("<li>"+inline(m[1])+"</li>");return;}
      if(ln.trim()===""){cl();return;}
      cl(); out.push("<p>"+inline(ln)+"</p>");
    });
    cl(); return out.join("\n");
  }
  function promptFor(r){
    return "Add this challenge to the CTF I'm building on the CTF blueprint, themed to "+
"<DESCRIBE YOUR CTF'S STORY HERE>.\nUse ONLY the mechanic below. Invent every name, filename, "+
"hostname, account and story fresh for this CTF — never carry over any old name or code. Mint a "+
"fresh flag plus an 8-char prefix/postfix and place the flag and access key per the \"What to plant\" "+
"section (different spots). Wire it as a normal blueprint challenge, then run challenge-tester.\n\n"+
"--- RECIPE: "+r.title+" ("+r.category+", "+r.difficulty+") ---\n"+r.body+"\n";
  }
  var _toast;
  function toast(msg){
    if(!_toast){_toast=document.createElement("div");_toast.style.cssText=
      "position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#4fd1c5;color:#08120f;"+
      "font-weight:700;padding:11px 18px;border-radius:10px;z-index:99;transition:opacity .2s";
      document.body.appendChild(_toast);}
    _toast.textContent=msg;_toast.style.opacity="1";setTimeout(function(){_toast.style.opacity="0";},1300);
  }
  function copy(text,msg){navigator.clipboard.writeText(text).then(function(){toast(msg||"copied");}).catch(function(){toast("copy failed");});}

  var modal;
  function openModal(r){
    if(!modal){
      modal=document.createElement("dialog");
      modal.style.cssText="max-width:780px;width:92%;border:1px solid #2a3340;border-radius:16px;background:#1b232c;color:#eaf0f6;padding:0";
      modal.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #2a3340;position:sticky;top:0;background:#1b232c">'+
        '<h2 id="cm-t" style="margin:0;font-size:19px"></h2><button id="cm-x" style="background:0;border:0;color:#8fa0b0;font-size:26px;cursor:pointer">&times;</button></div>'+
        '<div id="cm-b" style="padding:10px 20px 22px"></div>';
      document.body.appendChild(modal);
      modal.querySelector("#cm-x").onclick=function(){modal.close();};
      modal.addEventListener("click",function(e){if(e.target===modal)modal.close();});
    }
    modal.querySelector("#cm-t").textContent=r.title;
    var md_href=WEB+"../recipes/"+r.slug+".md";
    modal.querySelector("#cm-b").innerHTML=
      '<div style="color:#4fd1c5;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.4px">'+esc(r.category)+'</div>'+
      '<div style="margin:8px 0;color:#8fa0b0;font-size:12.5px">'+esc(r.difficulty)+' · '+esc(r.box_type)+(r.source_ctf?' · from <b style="color:#eaf0f6">'+esc(r.source_ctf)+'</b>':'')+'</div>'+
      '<div class="cm-md">'+md(r.body)+'</div>'+
      '<div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">'+
      '<a href="'+md_href+'" download style="background:#151b22;color:#eaf0f6;border:1px solid #2a3340;border-radius:8px;padding:7px 12px;text-decoration:none;font-size:12.5px">Download .md</a>'+
      '<button id="cm-cp" style="background:#151b22;color:#eaf0f6;border:1px solid #2a3340;border-radius:8px;padding:7px 12px;cursor:pointer;font-size:12.5px">Copy reuse prompt</button></div>';
    modal.querySelector("#cm-cp").onclick=function(){copy(promptFor(r),"prompt copied — paste into Claude in your CTF");};
    modal.showModal();
  }

  var CATALOG = {
    data:[], state:{cat:"",diff:"",ctf:""}, FIXED_CATS:FIXED_CATS,
    esc:esc, md:md, promptFor:promptFor, copy:copy, toast:toast, openModal:openModal,
    mdHref:function(slug){return WEB+"../recipes/"+slug+".md";},
    ctfs:function(){var s={};this.data.forEach(function(r){if(r.source_ctf)s[r.source_ctf]=1;});return Object.keys(s).sort();},
    catCounts:function(){var c={};this.data.forEach(function(r){c[r.category]=(c[r.category]||0)+1;});return c;},
    set:function(k,v){this.state[k]=v;repaint();},
    filtered:function(){
      var st=this.state;
      var rows=this.data.filter(function(r){
        return (!st.cat||r.category===st.cat)&&(!st.diff||r.difficulty===st.diff)&&(!st.ctf||r.source_ctf===st.ctf);});
      rows.sort(function(a,b){return (a.category||"").localeCompare(b.category||"")||(DORD[a.difficulty]-DORD[b.difficulty])||a.title.localeCompare(b.title);});
      return rows;
    },
    byslug:function(s){return this.data.find(function(r){return r.slug===s;});},
    cardHTML:function(r){
      return '<article class="box" data-slug="'+esc(r.slug)+'">'+
        '<div class="cattag">'+esc(r.category)+'</div>'+
        '<h2>'+esc(r.title)+'</h2>'+
        '<div class="badge '+r.difficulty+'">'+esc(r.difficulty)+'</div>'+
        '<div class="skills">'+(r.skills||[]).map(esc).join(" · ")+'</div>'+
        (r.source_ctf?'<div class="src">from <b>'+esc(r.source_ctf)+'</b></div>':'')+
        '<div class="btns"><button class="act view">View</button>'+
        '<a class="act" href="'+this.mdHref(r.slug)+'" download>.md</a>'+
        '<button class="act cp">Copy prompt</button></div></article>';
    },
    wire:function(container){
      var self=this;
      container.querySelectorAll(".box").forEach(function(box){
        var r=self.byslug(box.dataset.slug); if(!r)return;
        var v=box.querySelector(".view"); if(v)v.onclick=function(){openModal(r);};
        var cp=box.querySelector(".cp"); if(cp)cp.onclick=function(){copy(promptFor(r),"prompt copied");};
      });
    }
  };
  function repaint(){ if(window.paint) window.paint(CATALOG.filtered()); }
  window.CATALOG=CATALOG;
  fetch(WEB+"recipes.json").then(function(r){return r.json();}).then(function(d){
    CATALOG.data=d; if(window.onCatalog) window.onCatalog(d); repaint();
  }).catch(function(){ document.body.insertAdjacentHTML("beforeend","<p style='padding:24px;color:#8fa0b0'>recipes.json not found — run ./serve.sh</p>"); });
})();
