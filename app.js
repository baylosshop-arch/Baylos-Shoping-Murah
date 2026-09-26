/* ===================================
   BAYLOS V4 ENGINE
=================================== */

let products = [];

let settings = {};

let selectedCategory = "Semua";
let selectedLabel = "";
let productSort = "default";
let wishlistOnly = false;
let wishlistIds = new Set(JSON.parse(localStorage.getItem("baylos_wishlist") || "[]"));
let currentModalProductId = null;

/* ===================================
   BAYLOS ANALYTICS
=================================== */
let baylosDB = null;
let baylosSessionId = null;
let analyticsObserver = null;
const analyticsViewed = new Set();

function getBaylosSessionId(){
    let id = localStorage.getItem("baylos_session_id");
    if(!id){
        id = (window.crypto && crypto.randomUUID)
            ? crypto.randomUUID()
            : "baylos-" + Date.now() + "-" + Math.random().toString(36).slice(2);
        localStorage.setItem("baylos_session_id", id);
    }
    return id;
}

function analyticsSource(){
    const params = new URLSearchParams(location.search);
    const utm = (params.get("utm_source") || "").trim();
    if(utm) return utm;
    const ref = document.referrer || "";
    if(!ref) return "Langsung";
    try{
        const host = new URL(ref).hostname.toLowerCase();
        if(host.includes("google")) return "Google";
        if(host.includes("tiktok")) return "TikTok";
        if(host.includes("instagram")) return "Instagram";
        if(host.includes("facebook")) return "Facebook";
        if(host.includes("youtube")) return "YouTube";
        if(host.includes("whatsapp")) return "WhatsApp";
        return host;
    }catch(e){ return "Lainnya"; }
}

function analyticsDevice(){
    if(window.innerWidth <= 600) return "Mobile";
    if(window.innerWidth <= 1024) return "Tablet";
    return "Desktop";
}

function validUUID(value){
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

async function sendAnalyticsEvent(type, product){
    if(!baylosDB || !baylosSessionId) return;
    const payload = {
        session_id: baylosSessionId,
        event_type: type,
        product_id: validUUID(product?.id) ? product.id : null,
        product_name: product?.name || null,
        page: location.pathname || "home",
        source: analyticsSource(),
        referrer: document.referrer || null,
        device: analyticsDevice()
    };
    const {error} = await baylosDB.from("analytics_events").insert(payload);
    if(error) console.warn("Baylos Analytics:", error.message);
}

function initAnalytics(client){
    baylosDB = client;
    baylosSessionId = getBaylosSessionId();

    const pageViewKey = "baylos_page_view_sent";
    if(!sessionStorage.getItem(pageViewKey)){
        sessionStorage.setItem(pageViewKey, "1");
        sendAnalyticsEvent("page_view");
    }
}

function trackProductClick(id){
    const product = products.find(p => String(p.id) === String(id));
    sendAnalyticsEvent("affiliate_click", product || {id, name: null});
}

function observeProductViews(){
    if(analyticsObserver) analyticsObserver.disconnect();
    const cards = document.querySelectorAll("[data-analytics-product]");
    if(!cards.length || !baylosDB) return;
    if(!("IntersectionObserver" in window)){
        cards.forEach(card => {
            const id = card.dataset.productId || "";
            const key = id || card.dataset.productName || "";
            if(key && !analyticsViewed.has(key)){
                analyticsViewed.add(key);
                sendAnalyticsEvent("product_view", {id, name: card.dataset.productName || null});
            }
        });
        return;
    }
    analyticsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(!entry.isIntersecting) return;
            const card = entry.target;
            const id = card.dataset.productId || "";
            const key = id || card.dataset.productName || "";
            if(!key || analyticsViewed.has(key)) return;
            analyticsViewed.add(key);
            sendAnalyticsEvent("product_view", {id, name: card.dataset.productName || null});
            analyticsObserver.unobserve(card);
        });
    }, {threshold:0.35});
    cards.forEach(card => analyticsObserver.observe(card));
}



/* ===================================
   DEFAULT HERO
=================================== */

const defaultSettings = {

primary_color:"#172033",

accent_color:"#c9a45c",

background_color:"#f7f5f1",

border_color:"#e8e2d8",

hero_image_url:
"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=85",

hero_label:
"BAYLOS SHOPING MURAH",

hero_title:
"Fashion Cantik.\nHarga Bersahabat.",

hero_description:
"Temukan produk pilihan Baylos dengan harga menarik."

};


/* ===================================
   DEMO PRODUCT
   AKAN DIGANTI DATABASE
=================================== */

const demoProducts = [

{

id:"demo-1",

name:"Emilie Blouse Top",

category:"Fashion Wanita",

price:149000,

label:"BEST SELLER",

image_url:
"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",

affiliate_url:
"https://shop-id.tokopedia.com/view/product/1732323945743156700"

},

{

id:"demo-2",

name:"Premium Casual Shirt",

category:"Fashion Wanita",

price:129000,

label:"TERBARU",

image_url:
"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85",

affiliate_url:"#"

},

{

id:"demo-3",

name:"Elegant Daily Dress",

category:"Dress",

price:179000,

label:"PROMO",

image_url:
"https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85",

affiliate_url:"#"

}

];


/* ===================================
   ESCAPE HTML
=================================== */

function escapeHTML(value){

return String(value ?? "")

.replace(/[&<>"']/g,function(char){

return {

"&":"&amp;",

"<":"&lt;",

">":"&gt;",

'"':"&quot;",

"'":"&#39;"

}[char];

});

}


/* ===================================
   FORMAT PRICE
=================================== */

function formatPrice(price){

if(
price === null ||
price === undefined ||
price === ""
){

return "Lihat harga terbaru";

}

return new Intl.NumberFormat(
"id-ID",
{

style:"currency",

currency:"IDR",

maximumFractionDigits:0

}
).format(price);

}


/* ===================================
   APPLY THEME
=================================== */

function applySettings(){

const s = {

...defaultSettings,

...settings

};


document.documentElement
.style
.setProperty(
"--primary",
s.primary_color
);


document.documentElement
.style
.setProperty(
"--gold",
s.accent_color
);


document.documentElement
.style
.setProperty(
"--bg",
s.background_color
);


document.documentElement
.style
.setProperty(
"--line",
s.border_color
);


document
.getElementById("heroSlideMain")
.style
.setProperty(
"--hero-image",
`url("${s.hero_image_url}")`
);


document
.getElementById("heroLabel")
.textContent =
s.hero_label;


document
.getElementById("heroTitle")
.innerHTML =
escapeHTML(
s.hero_title
)
.replace(/\n/g,"<br>");


document
.getElementById("heroDescription")
.textContent =
s.hero_description;

}


/* ===================================
   CATEGORY
=================================== */

function renderCategories(){

const categories = [

"Semua",

...new Set(

products

.map(product =>
product.category
)

.filter(Boolean)

)

];


document
.getElementById("categories")
.innerHTML =

categories
.map(category => `

<button

class="category-btn
${category === selectedCategory ? "active" : ""}"

onclick='selectCategory(${JSON.stringify(category)})'

>

${escapeHTML(category)}

</button>

`)
.join("");

}


/* ===================================
   PRODUCTS
=================================== */

function renderProducts(){

const keyword = (
    document.getElementById("searchInput")?.value ||
    document.getElementById("productMiniSearch")?.value || ""
).toLowerCase().trim();

let filtered = products.filter(product => {
    const categoryMatch = selectedCategory === "Semua" || product.category === selectedCategory;
    const text = `${product.name || ""} ${product.category || ""} ${product.description || ""}`.toLowerCase();
    const searchMatch = text.includes(keyword);
    const labelMatch = selectedLabel === "" || String(product.label || "").toUpperCase().trim() === selectedLabel;
    const wishlistMatch = !wishlistOnly || wishlistIds.has(String(product.id));
    return categoryMatch && searchMatch && labelMatch && wishlistMatch;
});

if(productSort === "price-low") filtered.sort((a,b)=>(Number(a.price)||0)-(Number(b.price)||0));
if(productSort === "price-high") filtered.sort((a,b)=>(Number(b.price)||0)-(Number(a.price)||0));
if(productSort === "newest") filtered.sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0));
if(productSort === "name") filtered.sort((a,b)=>String(a.name||"").localeCompare(String(b.name||""),"id"));

document.getElementById("productCount").textContent = filtered.length + " produk";

const grid = document.getElementById("productGrid");
if(!filtered.length){
    grid.innerHTML = `<div class="empty"><h3>${wishlistOnly ? "Wishlist masih kosong" : "Produk tidak ditemukan"}</h3><p>${wishlistOnly ? "Tekan ikon ♡ pada produk untuk menyimpannya." : "Coba gunakan kata kunci atau filter lain."}</p></div>`;
    return;
}

grid.innerHTML = filtered.map(product => {
    const wished = wishlistIds.has(String(product.id));
    const safeId = escapeHTML(product.id || "");
    return `
<article class="product-card" data-analytics-product="1" data-product-id="${safeId}" data-product-name="${escapeHTML(product.name || "Produk Baylos")}">
  <div class="product-image" onclick="openProductModal('${safeId}')" role="button" tabindex="0" aria-label="Lihat ${escapeHTML(product.name || "produk")}">
    <img src="${escapeHTML(product.image_url || "https://placehold.co/800x800?text=Baylos")}" alt="${escapeHTML(product.name || "Produk Baylos")}" loading="lazy" onerror="this.src='https://placehold.co/800x800?text=Baylos'">
    ${product.label ? `<span class="product-label">${escapeHTML(product.label)}</span>` : ""}
    <button type="button" class="wishlist-btn ${wished ? "active" : ""}" onclick="event.stopPropagation();toggleWishlist('${safeId}')" aria-label="${wished ? "Hapus dari wishlist" : "Tambah ke wishlist"}">${wished ? "♥" : "♡"}</button>
  </div>
  <div class="product-info">
    <div class="product-category">${escapeHTML(product.category || "Produk")}</div>
    <div class="product-name">${escapeHTML(product.name || "Produk Baylos")}</div>
    <div class="rating">★★★★★</div>
    <div class="product-price">${formatPrice(product.price)}</div>
    <div class="product-card-actions">
      <button type="button" class="detail-button" onclick="openProductModal('${safeId}')">Detail</button>
      <a class="buy-button" href="${escapeHTML(product.affiliate_url || "#")}" target="_blank" rel="noopener noreferrer sponsored nofollow" onclick="return handleProductBuy(event,'${safeId}')">🛒 Beli</a>
    </div>
  </div>
</article>`;
}).join("");

observeProductViews();
}

/* ===================================
   PROJECT: BAYLOS-WISHLIST-03
=================================== */
function persistWishlist(){
    localStorage.setItem("baylos_wishlist", JSON.stringify([...wishlistIds]));
}
function toggleWishlist(id){
    id=String(id||"");
    if(!id) return;
    if(wishlistIds.has(id)) wishlistIds.delete(id); else wishlistIds.add(id);
    persistWishlist();
    renderProducts();
    updateWishlistButton();
    showBaylosToast(wishlistIds.has(id) ? "Produk disimpan ke Wishlist." : "Produk dihapus dari Wishlist.");
}
function toggleWishlistFilter(){
    wishlistOnly=!wishlistOnly;
    updateWishlistButton();
    renderProducts();
    goToSection("productsSection");
}
function updateWishlistButton(){
    const btn=document.getElementById("wishlistFilterBtn");
    if(btn){btn.classList.toggle("active",wishlistOnly);btn.textContent=`${wishlistOnly ? "♥" : "♡"} Wishlist (${wishlistIds.size})`;}
}

/* ===================================
   PROJECT: BAYLOS-PRODUCT-DETAIL-04
=================================== */
function getProductById(id){ return products.find(p=>String(p.id)===String(id)); }
function openProductModal(id){
    const product=getProductById(id);
    if(!product) return;
    currentModalProductId=String(id);
    const modal=document.getElementById("productModal");
    document.getElementById("modalProductImage").src=product.image_url || "https://placehold.co/800x800?text=Baylos";
    document.getElementById("modalProductImage").alt=product.name || "Produk Baylos";
    document.getElementById("modalProductCategory").textContent=product.category || "Produk";
    document.getElementById("modalProductName").textContent=product.name || "Produk Baylos";
    document.getElementById("modalProductPrice").textContent=formatPrice(product.price);
    document.getElementById("modalProductLabel").textContent=product.label || "Pilihan Baylos";
    document.getElementById("modalProductDescription").textContent=product.description || "Produk pilihan Baylos. Klik Beli Sekarang untuk melihat penawaran dari toko tujuan.";
    const buy=document.getElementById("modalBuyBtn");
    const url=safeAffiliateUrl(product.affiliate_url);
    buy.href=url || "#";
    buy.onclick=(event)=>handleProductBuy(event,String(id));
    updateModalWishlist();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
    sendAnalyticsEvent("product_detail_view",product);
}
function closeProductModal(){
    const modal=document.getElementById("productModal");
    if(!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
    currentModalProductId=null;
}
function updateModalWishlist(){
    const btn=document.getElementById("modalWishlistBtn");
    if(!btn) return;
    const active=currentModalProductId && wishlistIds.has(String(currentModalProductId));
    btn.classList.toggle("active",!!active);
    btn.textContent=active ? "♥" : "♡";
}
function toggleModalWishlist(){
    if(!currentModalProductId) return;
    toggleWishlist(currentModalProductId);
    updateModalWishlist();
}
async function shareCurrentProduct(){
    const product=getProductById(currentModalProductId);
    if(!product) return;
    const shareData={title:product.name||"Produk Baylos",text:`${product.name||"Produk Baylos"} — ${formatPrice(product.price)}`,url:location.href.split("#")[0]+"#produk="+encodeURIComponent(String(product.id))};
    try{
        if(navigator.share){await navigator.share(shareData);sendAnalyticsEvent("product_share",product);}
        else{await navigator.clipboard.writeText(shareData.url);showBaylosToast("Link produk berhasil disalin.");sendAnalyticsEvent("product_share",product);}
    }catch(e){ if(e?.name!=="AbortError") showBaylosToast("Link belum bisa dibagikan di perangkat ini."); }
}

/* ===================================
   PREMIUM SHOWCASE ENGINE
=================================== */
function createSliderCard(product){
    const image = product.image_url || "https://placehold.co/800x800?text=Baylos";
    const link = product.affiliate_url || "#";
    return `
        <article class="slider-card" data-analytics-product="1" data-product-id="${escapeHTML(product.id || "")}" data-product-name="${escapeHTML(product.name || "Produk Baylos")}">
            <div class="slider-image">
                <img src="${escapeHTML(image)}" alt="${escapeHTML(product.name || "Produk Baylos")}" loading="lazy" onerror="this.src='https://placehold.co/800x800?text=Baylos'">
                ${product.label ? `<span class="slider-label">${escapeHTML(product.label)}</span>` : ""}
            </div>
            <div class="slider-info">
                <div class="slider-category">${escapeHTML(product.category || "Produk")}</div>
                <div class="slider-name">${escapeHTML(product.name || "Produk Baylos")}</div>
                <div class="slider-price">${formatPrice(product.price)}</div>
                <a class="slider-buy" href="${escapeHTML(link || "#")}" target="_blank" rel="noopener noreferrer sponsored nofollow" onclick="return handleProductBuy(event,'${escapeHTML(product.id || "")}')">🛒 Beli Sekarang</a>
            </div>
        </article>`;
}

function renderLabelSlider(label, elementId){
    const element = document.getElementById(elementId);
    if(!element) return;
    const section = element.closest(".showcase-section");
    const items = products.filter(product => String(product.label || "").toUpperCase().trim() === label);
    if(!items.length){
        if(section) section.style.display = "none";
        return;
    }
    if(section) section.style.display = "block";
    element.innerHTML = items.map(createSliderCard).join("");
}

function renderShowcases(){
    renderLabelSlider("PROMO", "promoSlider");
    renderLabelSlider("BEST SELLER", "bestSellerSlider");
    renderLabelSlider("TERBARU", "latestSlider");
    observeProductViews();
}

function showLabelProducts(label){
    selectedLabel = label;
    selectedCategory = "Semua";
    const input = document.getElementById("searchInput");
    if(input) input.value = "";
    renderCategories();
    renderProducts();
    scrollToProducts();
}


/* =========================================================
   BAYLOS INTERACTION ENGINE — PROJECT: BAYLOS-UX-03
========================================================= */
let heroIndex = 0;
let heroTimer = null;
let heroTouchStartX = 0;

function goHome(){
  window.scrollTo({top:0,behavior:"smooth"});
  setActiveNav("home");
  closeMobileMenu();
}
function goToSection(id){
  const el=document.getElementById(id);
  if(el) el.scrollIntoView({behavior:"smooth",block:"start"});
  if(id==="categories") setActiveNav("category");
  if(id==="productsSection") setActiveNav("collection");
}
function focusSearch(){
  const input=document.getElementById("searchInput");
  if(input){input.focus(); input.scrollIntoView({behavior:"smooth",block:"center"});}
  setActiveNav("search");
  closeMobileMenu();
}
function setActiveNav(name){
  document.querySelectorAll(".baylos-bottom-nav button[data-nav]").forEach(btn=>btn.classList.toggle("active",btn.dataset.nav===name));
}
function openMobileMenu(){
  const menu=document.getElementById("mobileMenu"), overlay=document.getElementById("mobileMenuOverlay"), toggle=document.querySelector(".baylos-mobile-toggle");
  if(menu) {menu.classList.add("open");menu.setAttribute("aria-hidden","false");}
  if(overlay) overlay.classList.add("open");
  if(toggle) toggle.setAttribute("aria-expanded","true");
}
function closeMobileMenu(){
  const menu=document.getElementById("mobileMenu"), overlay=document.getElementById("mobileMenuOverlay"), toggle=document.querySelector(".baylos-mobile-toggle");
  if(menu) {menu.classList.remove("open");menu.setAttribute("aria-hidden","true");}
  if(overlay) overlay.classList.remove("open");
  if(toggle) toggle.setAttribute("aria-expanded","false");
}
function showBaylosToast(message){
  const toast=document.getElementById("baylosToast"); if(!toast) return;
  toast.textContent=message; toast.classList.add("show"); clearTimeout(window.baylosToastTimer);
  window.baylosToastTimer=setTimeout(()=>toast.classList.remove("show"),2200);
}
function heroGo(index){
  heroIndex=Math.max(0,Math.min(2,index));
  const track=document.getElementById("heroTrack"); if(track) track.style.transform=`translateX(-${heroIndex*33.333333}%)`;
  document.querySelectorAll("#heroDots button").forEach((b,i)=>b.classList.toggle("active",i===heroIndex));
}
function heroMove(step){heroGo((heroIndex+step+3)%3);}
function startHeroAuto(){clearInterval(heroTimer);heroTimer=setInterval(()=>heroMove(1),5500);}
function initHeroSwipe(){
  const slider=document.getElementById("heroSlider"); if(!slider) return;
  slider.addEventListener("touchstart",e=>{heroTouchStartX=e.changedTouches[0].clientX;},{passive:true});
  slider.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-heroTouchStartX;if(Math.abs(dx)>45) heroMove(dx<0?1:-1);},{passive:true});
  slider.addEventListener("mouseenter",()=>clearInterval(heroTimer));
  slider.addEventListener("mouseleave",startHeroAuto);
  startHeroAuto();
}
function safeAffiliateUrl(url){
  try{const u=new URL(String(url||""),location.href); return /^https?:$/.test(u.protocol)?u.href:"";}catch(e){return "";}
}
function handleProductBuy(event,id){
  const product=products.find(p=>String(p.id)===String(id));
  const url=safeAffiliateUrl(product?.affiliate_url);
  trackProductClick(id);
  if(!url){event.preventDefault();showBaylosToast("Link pembelian produk belum tersedia.");return false;}
  return true;
}

/* ===================================
   SELECT CATEGORY
=================================== */

function selectCategory(category){

selectedCategory = category;
selectedLabel = "";

renderCategories();

renderProducts();

}


/* ===================================
   SCROLL
=================================== */

function scrollToProducts(){

document
.getElementById("productsSection")
.scrollIntoView({
behavior:"smooth"
});

}


/* ===================================
   ADMIN
=================================== */

function openAdmin(){

window.location.href =
"admin.html";

}


/* ===================================
   LOAD DATABASE
=================================== */

async function loadStore(){

try{

const config =
window.BAYLOS_CONFIG || {};


if(

!config.SUPABASE_URL ||

!config.SUPABASE_ANON_KEY ||

config.SUPABASE_URL
.startsWith("ISI_")

){

console.warn(
"Supabase belum dikonfigurasi. Menggunakan produk demo."
);

products =
demoProducts;

settings =
defaultSettings;

applySettings();

renderCategories();

renderShowcases();

renderProducts();

return;

}


const client =
supabase.createClient(

config.SUPABASE_URL,

config.SUPABASE_ANON_KEY

);

initAnalytics(client);


/* PRODUCTS */

const productResult =
await client

.from("products")

.select("*")

.eq("is_active",true)

.order(
"sort_order",
{
ascending:true
}
)

.order(
"created_at",
{
ascending:false
}
);


if(productResult.error){

console.error(
productResult.error
);

products =
demoProducts;

}else{

products =
productResult.data || [];

}


/* SETTINGS */

const settingResult =
await client

.from("store_settings")

.select("*")

.eq("id",1)

.maybeSingle();


if(
settingResult.data
){

settings =
settingResult.data;

}else{

settings =
defaultSettings;

}


/* APPLY */

applySettings();

renderCategories();

renderShowcases();

renderProducts();


}catch(error){

console.error(error);

products =
demoProducts;

settings =
defaultSettings;

applySettings();

renderCategories();

renderShowcases();

renderProducts();

}

}


/* ===================================
   SEARCH ENTER
=================================== */

document
.getElementById("searchInput")
.addEventListener(
"keydown",
function(event){

if(event.key === "Enter"){

renderProducts();

}

});


document
.getElementById("searchInput")
.addEventListener(
"input",
function(){
    selectedLabel = "";
    renderProducts();
});


/* ===================================
   PROJECT: BAYLOS-TOOLS-05
=================================== */
const miniSearch=document.getElementById("productMiniSearch");
if(miniSearch){
  miniSearch.addEventListener("input",()=>{
    const main=document.getElementById("searchInput");
    if(main) main.value=miniSearch.value;
    selectedLabel="";
    renderProducts();
  });
}
const sortSelect=document.getElementById("productSort");
if(sortSelect){sortSelect.addEventListener("change",()=>{productSort=sortSelect.value;renderProducts();});}
updateWishlistButton();
document.addEventListener("keydown",e=>{if(e.key==="Escape") closeProductModal();});

/* ===================================
   START
=================================== */

loadStore();
