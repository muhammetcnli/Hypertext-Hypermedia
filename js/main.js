const xmlPath = "xml/hobby_philosophy.xml";
function loadXML(){
  return fetch(xmlPath).then(r=>r.text()).then(t=>new window.DOMParser().parseFromString(t,"application/xml"));
}
function textOf(node, selector){
  const el = node.querySelector(selector);
  return el ? el.textContent.trim() : "";
}
function attrOf(node, selector, attr){
  const el = node.querySelector(selector);
  return el ? el.getAttribute(attr) : null;
}
function fillIndex(xml){
  const name = textOf(xml,"personal > name");
  const summary = xml.querySelector("philosophyOverview") ? xml.querySelector("philosophyOverview").getAttribute("summary") : "";
  const branchList = document.getElementById("branch-list");
  branchList.innerHTML = "";
  const branches = xml.querySelectorAll("philosophyOverview branches branch, philosophyOverview > branches > branch");
  if(branches.length===0){
    const alt = xml.querySelectorAll("philosophyOverview branches branch");
    alt.forEach(b=>{})
  }
  const branchNodes = xml.getElementsByTagName("branch");
  for(let i=0;i<branchNodes.length;i++){
    const b = branchNodes[i];
    const li = document.createElement("li");
    const t = b.getAttribute("type") || "";
    const desc = textOf(b,"description");
    li.textContent = t + (desc ? ": " + desc : "");
    branchList.appendChild(li);
  }
  const overview = document.getElementById("overview-summary");
  if(overview) overview.textContent = summary || "No summary provided";
  const profileName = document.getElementById("profile-name");
  if(profileName) profileName.textContent = name || "No name";
  const weeklyBody = document.querySelector("#weekly-table tbody");
  weeklyBody.innerHTML = "";
  const days = xml.getElementsByTagName("day");
  for(let i=0;i<days.length;i++){
    const day = days[i];
    const dayName = day.getAttribute("name") || "";
    const acts = day.getElementsByTagName("activity");
    if(acts.length===0){
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      td1.textContent = dayName;
      const td2 = document.createElement("td");
      td2.textContent = "";
      const td3 = document.createElement("td");
      td3.textContent = "";
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      weeklyBody.appendChild(tr);
    } else {
      for(let j=0;j<acts.length;j++){
        const a = acts[j];
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.textContent = dayName;
        const td2 = document.createElement("td");
        td2.textContent = a.getAttribute("name") || "";
        const td3 = document.createElement("td");
        td3.textContent = a.getAttribute("durationHours") || "";
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        weeklyBody.appendChild(tr);
      }
    }
  }
  const extLinksEl = document.getElementById("external-links");
  extLinksEl.innerHTML = "";
  const links = xml.querySelectorAll("philosophyOverview > externalLinks > link");
  for(let i=0;i<links.length;i++){
    const l = links[i];
    const li = document.createElement("li");
    const a = document.createElement("a");
    const href = l.getAttribute("url") || l.textContent;
    a.href = href;
    a.textContent = l.textContent || href;
    a.target = "_blank";
    li.appendChild(a);
    extLinksEl.appendChild(li);
  }
  const footer = document.getElementById("footer-credit");
  if(footer){
    const owner = textOf(xml,"personal > name");
    footer.textContent = "© 2025 " + (owner || "");
  }
}
function fillGallery(xml){
  const grid = document.getElementById("gallery-grid");
  const sketchGrid = document.getElementById("sketch-grid");
  if(grid) grid.innerHTML = "";
  if(sketchGrid) sketchGrid.innerHTML = "";
  const photos = xml.querySelectorAll("philosophyOverview > gallery > photo");
  for(let i=0;i<photos.length;i++){
    const p = photos[i];
    const fname = p.getAttribute("filename");
    const captionEl = p.querySelector("caption");
    const caption = p.getAttribute("caption") || (captionEl ? captionEl.textContent.trim() : "");
    const fig = document.createElement("figure");
    const a = document.createElement("a");
    a.href = fname;
    a.className = "enlarge";
    const img = document.createElement("img");
    img.src = fname;
    img.alt = caption || "photo";
    a.appendChild(img);
    const figcap = document.createElement("figcaption");
    figcap.textContent = caption;
    fig.appendChild(a);
    fig.appendChild(figcap);
    if(grid) grid.appendChild(fig);
  }
  const sketches = xml.querySelectorAll("philosophyOverview > gallery > sketch");
  for(let i=0;i<sketches.length;i++){
    const p = sketches[i];
    const fname = p.getAttribute("filename");
    const captionEl = p.querySelector("caption");
    const caption = p.getAttribute("caption") || (captionEl ? captionEl.textContent.trim() : "");
    const fig = document.createElement("figure");
    const a = document.createElement("a");
    a.href = fname;
    a.className = "enlarge";
    const img = document.createElement("img");
    img.src = fname;
    img.alt = caption || "sketch";
    a.appendChild(img);
    const figcap = document.createElement("figcaption");
    figcap.textContent = caption;
    fig.appendChild(a);
    fig.appendChild(figcap);
    if(sketchGrid) sketchGrid.appendChild(fig);
  }
}
function fillEvents(xml){
  const eventsUl = document.getElementById("events-from-xml");
  if(!eventsUl) return;
  eventsUl.innerHTML = "";
  const events = xml.querySelectorAll("philosophyOverview > events > event");
  for(let i=0;i<events.length;i++){
    const e = events[i];
    const li = document.createElement("li");
    const title = textOf(e,"title");
    const loc = textOf(e,"location");
    const date = e.getAttribute("date") || "";
    li.textContent = title + (date ? " (" + date + ")" : "") + (loc ? " - " + loc : "");
    eventsUl.appendChild(li);
  }
}
document.addEventListener("DOMContentLoaded",function(){
  loadXML().then(xml=>{
    fillIndex(xml);
    fillGallery(xml);
    fillEvents(xml);
  }).catch(e=>{
    console.error("Failed to load XML",e);
  });
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  if(toggle && nav){
    toggle.addEventListener("click",()=>{
      nav.classList.toggle("open");
      const expanded = nav.classList.contains("open");
      toggle.setAttribute("aria-expanded",expanded?"true":"false");
    });
  }
  // Lightbox basit uygulama
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  const lightboxClose = document.getElementById("lightbox-close");
  function openLightbox(src, alt){
    if(!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "image";
    lightbox.classList.add("open");
    lightbox.focus();
  }
  function closeLightbox(){
    if(!lightbox) return;
    lightbox.classList.remove("open");
    lightboxImg.src = "";
  }
  if(lightboxClose){
    lightboxClose.addEventListener("click",closeLightbox);
  }
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape") closeLightbox();
  });
  document.addEventListener("click",e=>{
    if(lightbox && e.target===lightbox) closeLightbox();
  });
  document.addEventListener("click",e=>{
    const a = e.target.closest("a.enlarge");
    if(a){
      e.preventDefault();
      openLightbox(a.href, a.querySelector("img") ? a.querySelector("img").alt : "");
    }
  });
});
