import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, Gift, Heart,
  Instagram, MapPin, Menu, MessageCircle, Sparkles, X
} from "lucide-react";
import "./styles.css";

const IG = "https://www.instagram.com/ds_lumora/";
const media = ["IMG-20260903-WA0063.jpg", "IMG-20260905-WA0049.jpg", "IMG-20260922-WA0022.jpg", "IMG-20260922-WA0023.jpg", "IMG-20260922-WA0029.jpg", "IMG-20260922-WA0034.jpg", "IMG-20260922-WA0035.jpg", "IMG-20260922-WA0036.jpg", "IMG-20260922-WA0037.jpg", "IMG-20260922-WA0043.jpg", "IMG-20260922-WA0045.jpg", "IMG-20260922-WA0047.jpg", "IMG-20260922-WA0053.jpg", "IMG-20260922-WA0060.jpg", "IMG-20260922-WA0063.jpg", "IMG-20260922-WA0070.jpg", "IMG-20260922-WA0088.jpg", "IMG-20260922-WA0099.jpg", "IMG-20260922-WA0106.jpg", "IMG-20260922-WA0108.jpg", "IMG-20260922-WA0111.jpg", "IMG-20260922-WA0119.jpg", "IMG-20260922-WA0120.jpg", "IMG-20260922-WA0131.jpg", "IMG-20260922-WA0134.jpg", "IMG-20260922-WA0137.jpg", "IMG-20260922-WA0142.jpg"];

const categories = [
  ["all", "Everything"],
  ["bouquet", "Bouquets"],
  ["custom", "Custom Gifts"],
  ["keychain", "Keychains"],
  ["surprise", "Surprises"]
];

const tags = [
  "IMG-20260922-WA0060.jpg","IMG-20260922-WA0029.jpg","IMG-20260922-WA0022.jpg",
  "IMG-20260922-WA0043.jpg","IMG-20260922-WA0047.jpg","IMG-20260922-WA0034.jpg",
  "IMG-20260922-WA0035.jpg","IMG-20260922-WA0036.jpg","IMG-20260922-WA0037.jpg",
  "IMG-20260922-WA0045.jpg","IMG-20260922-WA0053.jpg","IMG-20260905-WA0049.jpg",
  "IMG-20260922-WA0063.jpg","IMG-20260922-WA0070.jpg","IMG-20260922-WA0088.jpg",
  "IMG-20260922-WA0111.jpg","IMG-20260922-WA0099.jpg","IMG-20260922-WA0108.jpg",
  "IMG-20260922-WA0119.jpg","IMG-20260903-WA0063.jpg","IMG-20260922-WA0106.jpg",
  "IMG-20260922-WA0120.jpg","IMG-20260922-WA0134.jpg","IMG-20260922-WA0137.jpg",
  "IMG-20260922-WA0131.jpg","IMG-20260922-WA0142.jpg"
];

const itemInfo = {
  "IMG-20260922-WA0060.jpg":["Lilac Bloom Bouquet","bouquet"],
  "IMG-20260922-WA0029.jpg":["Scarlet Rose Bouquet","bouquet"],
  "IMG-20260922-WA0022.jpg":["Red Rose Keepsake","bouquet"],
  "IMG-20260922-WA0043.jpg":["A Little Red Love","bouquet"],
  "IMG-20260922-WA0047.jpg":["Pastel Promise","bouquet"],
  "IMG-20260922-WA0034.jpg":["Chocolate & Flowers","surprise"],
  "IMG-20260922-WA0035.jpg":["Sweet Box Surprise","surprise"],
  "IMG-20260922-WA0036.jpg":["Purple Flower Keychain","keychain"],
  "IMG-20260922-WA0037.jpg":["Petal Bouquet","bouquet"],
  "IMG-20260922-WA0045.jpg":["Purple & Pink Keepsake","custom"],
  "IMG-20260922-WA0053.jpg":["Handmade Flower Charm","keychain"],
  "IMG-20260905-WA0049.jpg":["Self-Care Bouquet","custom"],
  "IMG-20260922-WA0063.jpg":["Pink Charm Keychain","keychain"],
  "IMG-20260922-WA0070.jpg":["Memory Box","custom"],
  "IMG-20260922-WA0088.jpg":["Colorful Flower Set","custom"],
  "IMG-20260922-WA0111.jpg":["Mini Flower Pots","custom"],
  "IMG-20260922-WA0099.jpg":["Little Box of Love","surprise"],
  "IMG-20260922-WA0108.jpg":["Cute Couple Keychains","keychain"],
  "IMG-20260922-WA0119.jpg":["Wrapped With Love","surprise"],
  "IMG-20260903-WA0063.jpg":["Red Charm Keychain","keychain"],
  "IMG-20260922-WA0106.jpg":["Custom Heart Charm","keychain"],
  "IMG-20260922-WA0120.jpg":["Flower & Treat Bouquet","custom"],
  "IMG-20260922-WA0134.jpg":["Pink Gift Wrap","surprise"],
  "IMG-20260922-WA0137.jpg":["Sunshine Bouquet","bouquet"],
  "IMG-20260922-WA0131.jpg":["Love Letter Surprise","custom"],
  "IMG-20260922-WA0142.jpg":["Yellow Flower Delivery","bouquet"]
};

function App(){
  const [menu,setMenu]=useState(false);
  const [filter,setFilter]=useState("all");
  const [light,setLight]=useState(null);
  const [scrolled,setScrolled]=useState(false);

  useEffect(()=>{
    const f=()=>setScrolled(window.scrollY>18);
    window.addEventListener("scroll",f); f();
    return()=>window.removeEventListener("scroll",f);
  },[]);

  const items=useMemo(()=>tags.map((file,i)=>{
    const [title,cat]=itemInfo[file]||["Made With Love","custom"];
    return {file,title,cat,index:i};
  }).filter(x=>filter==="all"||x.cat===filter),[filter]);

  const openOrder=()=>window.open(IG,"_blank","noopener,noreferrer");
  const scroll=(id)=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setMenu(false)};

  return <div className="app">
    <header className={"nav "+(scrolled?"solid":"")}>
      <button className="logo" onClick={()=>scroll("top")}>
        <img className="brand-logo-img" src="/media/lumora-logo.jpg" alt="DS Lumora"/>
        <span><strong>LUMORA</strong><small>HANDMADE WITH LOVE</small></span>
      </button>
      <nav className={menu?"mobile-open":""}>
        <button onClick={()=>scroll("story")}>Our Story</button>
        <button onClick={()=>scroll("gallery")}>The Little Things</button>
        <button onClick={()=>scroll("how")}>How It Works</button>
        <a href={IG} target="_blank" rel="noreferrer"><Instagram size={16}/> Instagram</a>
      </nav>
      <button className="hamb" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-left">
          <div className="eyebrow"><Sparkles size={14}/> LITTLE THINGS. BIG FEELINGS.</div>
          <h1>Give them<br/><i>a reason to</i> smile.</h1>
          <p className="hero-copy">Handmade bouquets, thoughtful keepsakes and customized gifts — created slowly, lovingly, and just for <em>them.</em></p>
          <div className="actions">
            <button className="btn dark" onClick={()=>scroll("gallery")}>Explore the little things <ArrowDownRight size={17}/></button>
            <a className="btn line" href={IG} target="_blank" rel="noreferrer"><Instagram size={17}/> @ds_lumora</a>
          </div>
          <div className="location"><MapPin size={14}/> Made in Gorakhpur <span>•</span> Custom orders welcome</div>
        </div>
        <div className="hero-collage">
          <div className="blob"></div>
          <figure className="hero-main"><img src="/media/IMG-20260922-WA0022.jpg" alt="Red handmade bouquet"/></figure>
          <figure className="hero-side"><img src="/media/IMG-20260922-WA0045.jpg" alt="Handmade keychains"/></figure>
          <div className="note note-a">made<br/><b>with love</b> ♡</div>
          <div className="note note-b"><span>01</span> your idea<br/><b>our hands</b></div>
          <div className="stamp">DS<br/><small>LUMORA</small></div>
        </div>
      </section>

      <section className="ticker" aria-label="brand categories">
        <div className="ticker-track">
          {[0, 1].map((set) => (
            <div className="ticker-group" key={set}>
              <span>BOUQUETS</span><i>✦</i>
              <span>CUSTOM GIFTS</span><i>✦</i>
              <span>KEYCHAINS</span><i>✦</i>
              <span>BIRTHDAY SURPRISES</span><i>✦</i>
              <span>MADE WITH LOVE</span><i>✦</i>
            </div>
          ))}
        </div>
      </section>

      <section className="reel-section">
  <div className="reel-copy">
    <div className="eyebrow"><Sparkles size={14}/> A LITTLE BEHIND THE MAGIC</div>
    <h2>Made by hands.<br/><i>Felt by hearts.</i></h2>
    <p>Every flower, ribbon and tiny detail is put together with love. Take a little peek behind DS Lumora.</p>
    <a className="btn dark" href={IG} target="_blank" rel="noreferrer"><Instagram size={17}/> See more on Instagram</a>
  </div>
  <div className="reel-frame">
    <div className="reel-ring"></div>
    <video src="/media/lumora-reel.mp4" poster="/media/lumora-reel-poster.jpg" autoPlay muted loop playsInline controls></video>
    <div className="reel-label"><span>DS</span> LUMORA · HANDMADE WITH LOVE</div>
  </div>
</section>

      <section id="story" className="story section">
        <div className="story-image"><img src="/media/IMG-20260922-WA0043.jpg" alt="DS Lumora bouquet"/></div>
        <div className="story-copy">
          <div className="eyebrow">THE LUMORA FEELING</div>
          <h2>Because the best gifts<br/>feel <i>personal.</i></h2>
          <p>At DS Lumora, we turn little ideas into little moments they'll want to keep. From a bunch of flowers to a tiny handmade charm, every piece is made with patience, detail and a whole lot of heart.</p>
          <p className="quote">“Not just something you give.<br/><b>Something they remember.</b>”</p>
          <button className="text-btn" onClick={()=>scroll("how")}>How we make it <ArrowUpRight size={17}/></button>
        </div>
      </section>

      <section id="gallery" className="gallery section">
        <div className="section-head">
          <div><div className="eyebrow">A LITTLE LUMORA</div><h2>Made for<br/><i>your people.</i></h2></div>
          <p>Pick a feeling. We'll help turn it into something they can hold, open, wear, keep — and smile at.</p>
        </div>
        <div className="filters">{categories.map(([key,label])=><button className={filter===key?"active":""} onClick={()=>setFilter(key)} key={key}>{label}</button>)}</div>
        <div className="masonry">
          {items.map((item,i)=><button className={"tile tile-"+(i%7)} key={item.file} onClick={()=>setLight(item)}>
            <img src={"/media/"+item.file} alt={item.title} loading="lazy"/>
            <span className="tile-shade"></span>
            <span className="tile-info"><small>{labelFor(item.cat)}</small><b>{item.title}</b><ArrowUpRight size={18}/></span>
          </button>)}
        </div>
      </section>

      <section id="how" className="how">
        <div className="how-inner">
          <div className="eyebrow">YOUR IDEA → OUR HANDS</div>
          <h2>Tell us who it's for.<br/><i>We'll make it special.</i></h2>
          <div className="steps">
            <div><span>01</span><Gift/><h3>Tell us the moment</h3><p>Birthday, anniversary, bestie, apology or simply “I miss you”.</p></div>
            <div><span>02</span><Heart/><h3>Pick your vibe</h3><p>Flowers, colors, charms, treats — we make it personal.</p></div>
            <div><span>03</span><Sparkles/><h3>We make the magic</h3><p>Handmade, packed beautifully and ready to make someone smile.</p></div>
          </div>
          <button className="btn dark big" onClick={openOrder}>Let's make something cute <ArrowUpRight size={18}/></button>
          <small className="hint">DM @ds_lumora to place a custom order</small>
        </div>
      </section>

      <section className="final">
        <div className="final-photo f1"><img src="/media/IMG-20260922-WA0137.jpg" alt="Sunshine bouquet"/></div>
        <div className="final-center"><span className="heart">♡</span><div className="eyebrow">FOR THE PEOPLE YOU LOVE</div><h2>A little love,<br/><i>wrapped up.</i></h2><a href={IG} target="_blank" rel="noreferrer" className="btn light"><Instagram size={17}/> Follow @ds_lumora</a></div>
        <div className="final-photo f2"><img src="/media/IMG-20260922-WA0108.jpg" alt="Cute keychains"/></div>
      </section>
    </main>

    <footer><div className="footer-brand"><img className="brand-logo-img" src="/media/lumora-logo.jpg" alt="DS Lumora"/><div><b>LUMORA</b><small>HANDMADE WITH LOVE</small></div></div><p>Gorakhpur · Handmade gifting studio</p><a href={IG} target="_blank" rel="noreferrer"><Instagram size={18}/></a></footer>

    <a className="float-order" href={IG} target="_blank" rel="noreferrer"><MessageCircle size={18}/><span>DM to order</span></a>

    {light && <div className="lightbox" onClick={()=>setLight(null)}>
      <button className="close" onClick={()=>setLight(null)}><X/></button>
      <button className="prev" onClick={(e)=>{e.stopPropagation();const i=items.findIndex(x=>x.file===light.file);setLight(items[(i-1+items.length)%items.length])}}><ChevronLeft/></button>
      <div className="light-content" onClick={e=>e.stopPropagation()}><img src={"/media/"+light.file} alt={light.title}/><div><small>{labelFor(light.cat)}</small><h3>{light.title}</h3><a href={IG} target="_blank" rel="noreferrer">Ask about this piece <ArrowUpRight size={16}/></a></div></div>
      <button className="next" onClick={(e)=>{e.stopPropagation();const i=items.findIndex(x=>x.file===light.file);setLight(items[(i+1)%items.length])}}><ChevronRight/></button>
    </div>}
  </div>
}

function labelFor(cat){return {bouquet:"Bouquet",custom:"Custom gift",keychain:"Keychain",surprise:"Surprise"}[cat]||"Handmade"}
createRoot(document.getElementById("root")).render(<App/>);
