//Mi base de datos con sus metodos para llamar
const db = {
  metodos: {
    find: (id) => {
      return db.productos.find((producto) => producto.id == id);
    },
    remove: (productos) => {
      productos.forEach((producto) => {
        const product = db.metodos.find(producto.id);
        product.cantidad = product.cantidad - producto.cantidad;
      });
    },
  },
  productos: [
    {
      id: 0,
      nombre: "Banana",
      precio: 220,
      cantidad: 10,
      image: "./imgs/banana.jpg",
    },
    {
      id: 1,
      nombre: "Frutilla",
      precio: 1200,
      cantidad: 20,
      image: "./imgs/frutilla.jpg",
    },
    {
      id: 2,
      nombre: "Papa",
      precio: 130,
      cantidad: 20,
      image: "./imgs/papa.jpg",
    },
    {
      id: 3,
      nombre: "Kiwi",
      precio: 300,
      cantidad: 15,
      image: "./imgs/kiwi.jpg",
    },
    {
      id: 4,
      nombre: "Pera",
      precio: 900,
      cantidad: 8,
      image: "./imgs/pera.jpg",
    },
    {
      id: 5,
      nombre: "Limon",
      precio: 200,
      cantidad: 30,
      image: "./imgs/limon.jpg",
    },
    {
      id: 6,
      nombre: "Papaya",
      precio: 1400,
      cantidad: 13,
      image: "./imgs/papaya.jpg",
    },
    {
      id: 7,
      nombre: "Palta",
      precio: 1300,
      cantidad: 10,
      image: "./imgs/palta.jpg",
    },
    {
      id: 8,
      nombre: "Melon",
      precio: 750,
      cantidad: 12,
      image: "./imgs/melon.jpg",
    },
    {
      id: 9,
      nombre: "Maracuya",
      precio: 1800,
      cantidad: 5,
      image: "./imgs/maracuya.jpg",
    },
    {
      id: 10,
      nombre: "Zapallo",
      precio: 400,
      cantidad: 20,
      image: "./imgs/zapallo.jpg",
    },
    {
      id: 11,
      nombre: "Morron",
      precio: 1200,
      cantidad: 15,
      image: "./imgs/morron.jpg",
    },
    {
      id: 12,
      nombre: "Sandia",
      precio: 650,
      cantidad: 10,
      image: "./imgs/sandia.jpg",
    },
    {
      id: 13,
      nombre: "Uva",
      precio: 2000,
      cantidad: 10,
      image: "./imgs/uva.jpg",
    },
    {
      id: 14,
      nombre: "Durazno",
      precio: 620,
      cantidad: 8,
      image: "./imgs/durazno.jpg",
    },
    {
      id: 15,
      nombre: "Tomate",
      precio: 480,
      cantidad: 20,
      image: "./imgs/tomate.jpg",
    },
    {
      id: 16,
      nombre: "Naranja",
      precio: 220,
      cantidad: 50,
      image: "./imgs/naranja.jpg",
    },
    {
      id: 17,
      nombre: "Lechuga",
      precio: 720,
      cantidad: 6,
      image: "./imgs/lechuga.jpg",
    },
  ],
};

const carritoDeCompra = {
  productos: [],
  metodos: {
    add: (id, cantidad) => {
      const productoCarrito = carritoDeCompra.metodos.get(id);
      if (productoCarrito) {
        if (
          carritoDeCompra.metodos.hasInventory(
            id,
            cantidad + productoCarrito.cantidad
          )
        ) {
          productoCarrito.cantidad += cantidad;
        } else {
          //UTILIZANDO SweetAlert 
          Swal.fire('Producto Agotado')
        }
      } else {
        carritoDeCompra.productos.push({ id, cantidad });
      }
    },

    remove: (id, cantidad) => {
      const productoCarrito = carritoDeCompra.metodos.get(id);
      if (productoCarrito.cantidad - cantidad > 0) {
        productoCarrito.cantidad -= cantidad;
      } else {
        carritoDeCompra.productos = carritoDeCompra.productos.filter(
          (producto) => producto.id != id
        );
      }
    },

    count: () => {
      return carritoDeCompra.productos.reduce(
        (acc, producto) => acc + producto.cantidad,
        0
      );
    },

    get: (id) => {
      const index = carritoDeCompra.productos.findIndex(
        (producto) => producto.id == id
      );
      return index >= 0 ? carritoDeCompra.productos[index] : null;
    },

    getTotal: () => {
      const total = carritoDeCompra.productos.reduce((acc, producto) => {
        const found = db.metodos.find(producto.id);
        return acc + found.precio * producto.cantidad;
      }, 0);
      return total;
    },

    hasInventory: (id, cantidad) => {
      return (
        db.productos.find((producto) => producto.id == id).cantidad -
          cantidad >=
        0
      );
    },

    comprar: () => {
      db.metodos.remove(carritoDeCompra.productos);
      carritoDeCompra.productos = [];
    },
  },
};

renderStore();

function renderStore() {
  const html = db.productos.map((producto) => {
    return `
    <div class="producto">
      <img class="imagen" src="${producto.image}" alt="${producto.nombre}">
      <div class="nombre">${producto.nombre}</div>
      <div class="precio">${numberToCurrency(producto.precio)} / kg</div>
      <div class="cantidad">${producto.cantidad} kgs Disponibles</div>

      <div class="actions">
        <button 
        class="add" 
        data-id="${producto.id}">
        Añadir al carrito</button>
      </div>
    </div>
    `;
  });

  document.querySelector("#store-container").innerHTML = html.join("");

  //listener para nuestros botones
  document.querySelectorAll(".producto .actions .add").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(button.getAttribute("data-id"));
      const producto = db.metodos.find(id);
      //Si al decrementar el producto sigue siendo mayor a 0, puedo añadir mas.
      if (producto && producto.cantidad - 1 > 0) {
        //añadir a Carrito de Compra
        carritoDeCompra.metodos.add(id, 1);
        //UTILIZANDO SweetAlert
        Swal.fire('Agregado Correctamente')
        rendercarritoDeCompra();
      } else {
        //UTILIZANDO SweetAlert
        Swal.fire('Sin Stock')
      }
    });
  });
}

function rendercarritoDeCompra() {
  const html = carritoDeCompra.productos.map((producto) => {
    const dbproducto = db.metodos.find(producto.id);
    return `
      <div class="producto">
        <div class="nombre">${dbproducto.nombre}</div>
        <div class="precio">${numberToCurrency(dbproducto.precio)}</div>
        <div class="cantidad">${producto.cantidad} kg comprados! </div>
        <div class="subtotal">
        SubTotal:${numberToCurrency(producto.cantidad * dbproducto.precio)} 
        </div>
        <div class="actions">
          <button class="agregarUno" data-id="${producto.id}">+</button>
          <button class="eliminarUno" data-id="${producto.id}">-</button>
        </div>
      </div>
    `;
  });

  const closeButton = `
    <div class="cart-header">
      <button class="buttonCerrar">Cerrar</button>
    </div>
  `;
  const comprarButton =
    carritoDeCompra.productos.length > 0
      ? `
    <div class="cart-actions">
      <button class="bCompra" id="bCompra">comprar</button>
    </div>
  `
      : "";

  const total = carritoDeCompra.metodos.getTotal();
  const totalContainer = `
    <div class="total" >
    Total: ${numberToCurrency(total)}
    </div>
  `;

  const carritoDeCompraContainer = document.querySelector(
    "#carrito-compra-container"
  );
  carritoDeCompraContainer.classList.remove("hide");
  carritoDeCompraContainer.classList.add("show");

  carritoDeCompraContainer.innerHTML =
    closeButton + html.join("") + totalContainer + comprarButton;

  document.querySelectorAll(".agregarUno").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(button.getAttribute("data-id"));
      carritoDeCompra.metodos.add(id, 1);
      rendercarritoDeCompra();
    });
  });

  document.querySelectorAll(".eliminarUno").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(button.getAttribute("data-id"));
      carritoDeCompra.metodos.remove(id, 1);
      rendercarritoDeCompra();
    });
  });

  document.querySelector(".buttonCerrar").addEventListener("click", (e) => {
    carritoDeCompraContainer.classList.remove("show");
    carritoDeCompraContainer.classList.add("hide");
  });

  const bCompra = document.querySelector("#bCompra");
  if (bCompra) {
    bCompra.addEventListener("click", (e) => {
      carritoDeCompra.metodos.comprar();
      renderStore();
//UTILIZANDO SweetAlert 
Swal.fire({
  title: '¡¡¡GRACIAS POR SU COMPRA!!!',
  imageUrl: './imgs/buycart.jpg',
  imageWidth: 400,
  imageHeight: 200,
  imageAlt: 'BUY CART',
})

      rendercarritoDeCompra();
    });
  }
}

//Para imprimir el precio como si fueran Pesos Argentinos en este caso
function numberToCurrency(n) {
  return new Intl.NumberFormat("es-AR", {
    maximumSignificantDigits: 2,
    style: "currency",
    currency: "ars",
  }).format(n);
}

// Flecha flotante para ir arriba
const buttonTop = document.querySelector("#buttonTop");

window.onscroll = () => {
  if (document.documentElement.scrollTop > 100) {
    buttonTop.classList.add("shows");
  } else {
    buttonTop.classList.remove("shows");
  }
  buttonTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
};

//VENTANA DE INICIO DE SESION (MODAL)
const btnAbrirModal = document.querySelector("#btn-abrir-modal");
const btnCerrarModal = document.querySelector("#btn-cerrar-modal");
const modal = document.querySelector("#modal");
btnAbrirModal.addEventListener("click", () => {
  modal.showModal();
});
// btnCerrarModal.addEventListener("click", () => {
//   modal.close();
// });

// SESSION STORAGE
const user = document.querySelector("#user");
const password = document.querySelector("#password");

let userLogin;
let passwordLogin;

user.addEventListener("input", (e) => {
  userLogin = e.target.value;
});

password.addEventListener("input", (e) => {
  passwordLogin = e.target.value;
});

const botonLogin = document.querySelector("#buttonLogin");

const login = () => {
  console.log("Entrando");
  if (user === "" && password === "") {
    return;
  } else {
    console.log("Ingreso Correctamente");
    //UTILIZANDO SweetAlert 
    Swal.fire('Ingreso Correctamente')
    sessionStorage.setItem(
      "user",
      JSON.stringify({ user: userLogin, password: passwordLogin })
    );
  }
};

botonLogin.addEventListener("click", () => {
  login();
});

const botonLogout = document.querySelector('#buttonLogout')

botonLogout.addEventListener("click", () => {
  sessionStorage.clear()
  window.location.reload()
})