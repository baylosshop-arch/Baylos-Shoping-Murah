let products = [];

let settings = {};

let selectedCategory = "Semua";

let selectedLabel = "";


/* ===================================
   PREMIUM SHOWCASE
=================================== */

function createSliderCard(product){

    const image =
        product.image_url ||
        "https://placehold.co/800x800?text=Baylos";

    const link =
        product.affiliate_url || "#";

    return `
        <article class="slider-card">

            <div class="slider-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(product.name || "Produk Baylos")}"
                    loading="lazy"
                    onerror="this.src='https://placehold.co/800x800?text=Baylos'"
                >

                ${product.label ? `
                    <span class="slider-label">
                        ${escapeHTML(product.label)}
                    </span>
                ` : ""}

            </div>

            <div class="slider-info">

                <div class="slider-category">
                    ${escapeHTML(product.category || "Produk")}
                </div>

                <div class="slider-name">
                    ${escapeHTML(product.name || "Produk Baylos")}
                </div>

                <div class="slider-price">
                    ${formatPrice(product.price)}
                </div>

                <a
                    href="${escapeHTML(link)}"
                    target="_blank"
                    rel="noopener noreferrer sponsored nofollow"
                    class="slider-buy"
                    onclick="trackProductClick('${escapeHTML(product.id || "")}')"
                >
                    🛒 Beli
                </a>

            </div>

        </article>
    `;
}


function renderLabelSlider(label, elementId){

    const element =
        document.getElementById(elementId);

    if(!element) return;

    const labelProducts =
        products.filter(product =>
            String(product.label || "")
            .toUpperCase()
            .trim() === label
        );

    const section =
        element.closest(".showcase-section");

    if(!labelProducts.length){

        if(section){
            section.style.display = "none";
        }

        return;
    }

    if(section){
        section.style.display = "block";
    }

    element.innerHTML =
        labelProducts
        .map(createSliderCard)
        .join("");
}


function renderShowcases(){

    renderLabelSlider(
        "PROMO",
        "promoSlider"
    );

    renderLabelSlider(
        "BEST SELLER",
        "bestSellerSlider"
    );

    renderLabelSlider(
        "TERBARU",
        "latestSlider"
    );

}


function showLabelProducts(label){

    selectedLabel = label;

    selectedCategory = "Semua";

    document
        .getElementById("searchInput")
        .value = "";

    renderCategories();

    renderProducts();

    scrollToProducts();

          }


const labelMatch =
    selectedLabel === "" ||
    String(product.label || "")
    .toUpperCase()
    .trim() === selectedLabel;

return categoryMatch &&
searchMatch &&
labelMatch;


function selectCategory(category){

    selectedCategory = category;

    selectedLabel = "";

    renderCategories();

    renderProducts();

}

applySettings();

renderCategories();

renderShowcases();

renderProducts();


applySettings();
renderCategories();
renderShowcases();
renderProducts();



applySettings();
renderCategories();
renderShowcases();
renderProducts();


applySettings();
renderCategories();
renderShowcases();
renderProducts();


document
.getElementById("searchInput")
.addEventListener(
    "input",
    function(){

        selectedLabel = "";

        renderProducts();

    }
);


