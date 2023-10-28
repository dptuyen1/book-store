const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

window.onload = () => {
  loadCategories();
  loadSearchHistory();
  if (window.location.href.indexOf("index.html") !== -1) {
    loadBooks();
  }
  if (window.location.href.indexOf("checkout.html") !== -1) {
    loadCheckout();
  }
  loadMenuShortcut();
};

window.onscroll = () => {
  showGoToTop();
};

// Window Events
function loadCategories() {
  fetch("/assets/data/category.json")
    .then((res) => res.json())
    .then((data) => {
      let category = "";
      let shortcut = "";

      for (let d of data) {
        category += `
        <li class="item">
          <a href="#" class="item__link">
            <span>${d.name}</span>
          `;

        shortcut += `
          <a href="#" class="shortcut-item__link">${d.name}</a>`;

        if ($(".category__list") === null) {
          const menu = document.createElement("ul");
          menu.className = "category__list";
          menu.id = "category";
          $(".category").appendChild(menu);
        }

        if (d.hasOwnProperty("child") && typeof d.child === "object") {
          category += `<i class="fa-solid fa-chevron-right"></i></a>`;
          category += `<ul class="category__list sub-category">`;
          for (let l of d.child) {
            category += `
            <li class="item">
              <a href="#" class="item__link">
                <span>${l.name}</span>  
            `;

            if (l.hasOwnProperty("child") && typeof l.child === "object") {
              category += `<i class="fa-solid fa-chevron-right"></i></a>`;
              category += `<ul class="category__list inner-category">`;

              for (let e of l.child) {
                category += `
                <li class="item">
                  <a href="#" class="item__link">${e}</a>
                </li>
                `;
              }
              category += `</ul></li>`;
            } else category += `</a>`;
          }
          category += `</ul>`;
        } else category += `</a>`;
      }
      category += `</li>`;
      $("#category").innerHTML = category;
      $(".shortcut").innerHTML = shortcut;
    })
    .catch(() => {
      return;
    });
}

function loadSearchHistory() {
  fetch("/assets/data/search-history.json")
    .then((res) => res.json())
    .then((data) => {
      let history = "";

      if (typeof data === "object") {
        history += `
          <h5 class="search-history__title">Lịch sử tìm kiếm</h5>
        `;

        for (let d of data) {
          history += `
          <a href="#" class="search-history__text">
            ${d}
          </a>
          `;
        }
        $(".search-history").innerHTML = history;
      }
    })
    .catch(() => {
      $(".search-history").innerHTML = `
        <h5 class="search-history__title">Lịch sử trống</h5>
      `;
    });
}

function loadBooks() {
  fetch("/assets/data/book.json")
    .then((res) => res.json())
    .then((data) => {
      let book = "";

      for (let d of data) {
        book += `
        <a href="#">
            <img src="${d.ads}" alt="" class="ads-img" />
        </a>
        `;

        book += `
        <div class="top-content">
          <div class="content content--left">
            <h2 class="content__title">
              <i class="fa-solid fa-book content__icon"></i>
              <span class="content__text">${d.type}</span>
            </h2>

            <a href="#">
              <img src="${d.bookAds}" alt="" class="book-ads-img" />
            </a>

            <div class="books">`;
        for (let l of d.books) {
          book += `
          <div class="book" id="book-${l.id}">
            <div class="book__img" style="background-image: url(${l.image})"></div>
            <h3 class="book__name">
              ${l.name}
            </h3>
            <div class="price">
              <p class="og-price">${l.ogPrice}đ</p>
              <p class="discount-price">${l.discountPrice}đ</p>
            </div>
            <p class="percentage">${l.percentage}</p>
            <a href="javascript:;" class="book__btn btn">
              <i class="fa-solid fa-cart-shopping"></i>
              <span class="btn__buy">MUA NGAY</span>
            </a>
          </div>
          `;
        }
        book += `</div></div>`;
        book += `
        <div class="content content--right">
          <h2 class="best-seller__title">SẢN PHẨM BÁN CHẠY</h2>

          <div class="best-sellers">
        `;
        for (let l of d.bestSellers) {
          let star = l.star;
          book += `
          <div class="best-seller">
            <div class="img-wrapper">
              <img
                src="${l.image}"
                alt="Book"
                class="best-seller__img"
              />
            </div>

            <div class="best-seller__info">
              <h3 class="info__title">
                ${l.name}
              </h3>
              <div class="info__rate">
              ${
                star === 1
                  ? `<i class="fa-solid fa-star rate__icon"></i>`
                  : `${Array(star)
                      .fill()
                      .map(() => `<i class="fa-solid fa-star rate__icon"></i>`)
                      .join("")}`
              }
                <p class="comment">${l.comment}</p>
              </div>
              <div class="info__price">
                <p class="og-price">${l.ogPrice}đ</p>
                <p class="discount-price">${l.discountPrice}đ</p>
                <p class="discount__percentage">${l.percentage}</p>
              </div>
            </div>
          </div>
          `;
        }
        book += `</div></div></div>`;
      }
      book += `</div>`;
      $("#main-top").innerHTML = book;

      // Sự kiện AddToCart
      let buyButtons = $$(".book__btn");

      for (let b of buyButtons) {
        b.onclick = function () {
          let parent = this.parentNode;
          let id = parent.id;
          id = id.slice(5);
          let quantity = 1;
          let img = parent.children[0].style.backgroundImage
            .slice(4, -1)
            .replace(/"/g, "");
          let name = parent.children[1].innerText;
          let price = parent.children[2].children[1].innerText;

          let check = "cart-stuff-" + id;

          let e = $("#" + check);

          // Tăng số lượng sản phẩm trong cart nếu đã tồn tại sẵn
          if (e) {
            let q = e.children[1].children[1].children[0].innerText;
            q = parseInt(q.slice(1));
            q++;
            e.children[1].children[1].children[0].innerText = "x" + q;
          } else {
            let cart = "";
            cart += `
            <div class="cart-added_stuff" id="cart-stuff-${id}">
              <div class="stuff-img__wrapper">
                <img
                  src="${img}"
                  alt="Book"
                  class="stuff__img"
                />
              </div>
              <div class="stuff__inform">
                <h3 class="stuff__name">
                  ${name}
                </h3>
                <p class="stuff__price">
                  ${price} <span class="stuff_quantity">x${quantity}</span>
                </p>
              </div>
              <i class="fa-solid fa-xmark del-cart"></i>
            </div>
            `;
            $(".cart-stuffs").innerHTML += cart;
          }

          // Cập nhật tổng tiền
          let cash = $(".checkout__cash").innerText;
          cash = cash.replace("đ", "");
          cash = parseFloat(cash);
          price = price.slice(0, price.length - 1);
          price = parseFloat(price);
          let total = price * quantity;
          cash += total;
          $(".checkout__cash").innerText = cash.toFixed(3).toString() + "đ";

          $(".cart-full").style.display = "block";
          $(".cart-added").style.width = "max-content";
          $(".cart-added").style.height = "unset";
          $(".cart-empty").style.display = "none";

          let q = $(".cart__quantity");
          q = parseInt(q.innerText);
          q++;
          $(".cart__quantity").innerText = q.toString();
          $(".title__name > span").innerText = " (" + q.toString() + ")";

          // Sự kiện Delete Cart
          let delButtons = $$(".del-cart");

          for (let b of delButtons) {
            b.onclick = function () {
              let parent = this.parentNode;

              // Lấy ra số lượng sách của node đang xóa
              let q = parent.children[1].children[1].children[0].innerText;
              // Lấy ra số tiền của node đang xóa
              let c = parent.children[1].children[1].innerText;
              c = c.substring(0, c.indexOf("đ"));
              q = q.replace("x", "");
              q = parseInt(q);
              c = parseFloat(c);
              // Tính tổng
              t = (q * c).toFixed(3);
              this.parentNode.remove();

              let quantity = $(".cart__quantity");
              quantity = parseInt(quantity.innerText);
              quantity -= q;
              $(".cart__quantity").innerText = quantity.toString();
              $(".title__name > span").innerText =
                " (" + quantity.toString() + ")";

              let total = $(".checkout__cash").innerText;
              total = parseFloat(total).toFixed(3);
              total -= t;
              $(".checkout__cash").innerText =
                total.toFixed(3).toString() + "đ";

              if (quantity === 0) {
                $(".cart-full").style.display = "none";
                $(".cart-added").style.width = "400px";
                $(".cart-added").style.height = "300px";
                $(".cart-empty").style.display = "block";
              }
            };
          }
        };
      }
    });
}

function loadCheckout() {
  fetch("/assets/data/cart.json")
    .then((res) => res.json())
    .then((data) => {
      let cart = "";

      for (let l of data) {
        cart += `
        <div class="checkout__stuff">
          <div class="co-stuff-img__wrapper">
            <img
              src="${l.image}"
              alt="Book"
              class="co-stuff-img"
            />
          </div>

          <h3 class="co-stuff__name">
            ${l.name}
          </h3>

          <div class="co-stuff__function">
            <div class="co-stuff__price">
              <p class="co-og-price">${l.price}đ</p>
              <p class="co-discount-price">${l.discountPrice}đ</p>
            </div>

            <div class="input__function">
              <i class="fa-solid fa-minus function__btn"></i>
              <input type="number" class="co-input" value="${l.quantity}" readonly/>
              <i class="fa-solid fa-plus function__btn"></i>
            </div>
          </div>
        </div>
        `;
      }
      $(".checkout__stuffs").innerHTML = cart;

      let inputs = $$(".co-input");
      let total_quantity = 0;
      for (let input of inputs) {
        total_quantity += parseInt(input.value);
      }
      $(".checkout__quantity").innerText = "(" + total_quantity + " sản phẩm)";
      let add = $$(".fa-plus");

      for (let a of add) {
        a.onclick = function () {
          let parent = this.parentNode;
          let value = parent.childNodes[3].value;
          value = parseInt(value);
          if (value >= 1) {
            value++;
            total_quantity++;
          }
          parent.childNodes[3].setAttribute("value", value);
          $(".checkout__quantity").innerText =
            "(" + total_quantity + " sản phẩm)";
        };
      }

      let minus = $$(".fa-minus");
      for (let m of minus) {
        m.onclick = function () {
          let parent = this.parentNode;
          let value = parent.childNodes[3].value;
          value = parseInt(value);
          if (value > 1) {
            value--;
            total_quantity--;
          }
          parent.childNodes[3].setAttribute("value", value);
          $(".checkout__quantity").innerText =
            "(" + total_quantity + " sản phẩm)";
        };
      }

      $(".sum__price").innerText = total.toFixed(3) + "đ";
      $(".total__price").innerText = total.toFixed(3) + "đ";
    });
}

function loadMenuShortcut() {
  fetch("/assets/data/category.json")
    .then((res) => res.json())
    .then((data) => {
      let category = "";

      for (let d of data) {
        category += `
        <li class="menu-short__menu-item">
          <a href="#" class="menu-short__menu-link">
            <span>${d.name}</span>
          `;

        if ($(".menu-short__menu") === null) {
          const menu = document.createElement("ul");
          menu.className = "menu-short__menu";
          menu.id = "category-shortcut";
          $(".menu-shortcut").appendChild(menu);
        }

        if (d.hasOwnProperty("child") && typeof d.child === "object") {
          category += `<i class="fa-solid fa-plus"></i></a>`;
          category += `<ul class="menu-short__menu sub-menu">`;
          for (let l of d.child) {
            category += `
            <li class="menu-short__menu-item">
              <a href="#" class="menu-short__menu-link">
                <span>${l.name}</span>  
            `;

            if (l.hasOwnProperty("child") && typeof l.child === "object") {
              category += `<i class="fa-solid fa-plus"></i></a>`;
              category += `<ul class="menu-short__menu inner-menu">`;

              for (let e of l.child) {
                category += `
                <li class="menu-short__menu-item">
                  <a href="#" class="menu-short__menu-link">${e}</a>
                </li>
                `;
              }
              category += `</ul></li>`;
            } else category += `</a>`;
          }
          category += `</ul>`;
        } else category += `</a>`;
      }
      category += `</li>`;
      $("#category-shortcut").innerHTML += category;
    })
    .catch(() => {
      return;
    });
}
// Onclick Events
function showModal() {
  $(".modal").style.display = "block";
  $(".modal-container").style.animation = "topDown 1s ease";
}

function closeModal() {
  $(".modal").style.display = "none";
}

function showGoToTop() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    $("#go-to-top").style.display = "flex";
  } else {
    $("#go-to-top").style.display = "none";
  }
}

function delAll() {
  let e = $(".cart-stuffs");
  e.innerHTML = "";
  $(".cart__quantity").innerText = 0;
  $(".title__name > span").innerText = " (0)";
  $(".cart-full").style.display = "none";
  $(".cart-added").style.width = "400px";
  $(".cart-added").style.height = "300px";
  $(".cart-empty").style.display = "block";
}

function showMenu() {
  let menu = $(".menu-shortcut");
  menu.style.animation = "showMenu 1s forwards";
  menu.style.display = "block";
}

function closeMenu() {
  let menu = $(".menu-shortcut");
  menu.style.display = "none";
}
