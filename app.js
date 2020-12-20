// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', e => { 
    obtenerProductos();
});

//Con el evento de arriba y este try/catch aseguramos la carga correcta del documento
const obtenerProductos = async () => {
    try {
        const res = await fetch('api.json');
        const data = await res.json();
       //console.log(data);
       pintarProductos(data);
       detectarBotones(data);
    } catch (error) {
        console.log(error);
    }
}

const contenedorProductos = document.querySelector("#contenedor-producto");

const pintarProductos = (data) => {
    const template = document.querySelector("#template-producto").content;
    const fragment = document.createDocumentFragment();
        //console.log(template);

    data.forEach(producto => { //recorremos cada producto
        //console.log(producto);
        template.querySelector("img").setAttribute("src", producto.thumbnailUrl); //capturamos la img de cada producto
        template.querySelector("h5").textContent = producto.title;
        template.querySelector("p span").textContent = producto.precio;
        template.querySelector("button").dataset.id = producto.id; //utilizamos dataset para que cada boton que creemos no se repita su id y asi rescata el id de cada producto

        const clone = template.cloneNode(true); //clonamos el template para todos los demas productos
        fragment.appendChild(clone); //al tener cada fragmento vacio le añadimos un template 
    });

    contenedorProductos.appendChild(fragment); //añadimos a nuestro id toda la estructura del fragment
}

//usaremos objetos en vez de un array
let carrito = {};

const detectarBotones = (data) =>{
    const botones = document.querySelectorAll(".card button");
    //console.log(botones);

    botones.forEach(boton => {
        boton.addEventListener("click", () => {   //o tambien ('click', function(){}
            //console.log(boton.dataset.id);
            const producto = data.find(item => item.id === parseInt(boton.dataset.id)); //buscamos el id(int) y lo comparamos y parseamos del id string a numero
            //console.log(producto);
            producto.cantidad = 1; 
            if(carrito.hasOwnProperty(producto.id)){ //si existe la propiedad(ese id del producto)
               producto.cantidad = carrito[producto.id].cantidad +1;
            }
            carrito[producto.id] = { ...producto}; //split operator
            //console.log(carrito);
            pintarCarrito();
        });

    });
}
const items = document.querySelector("#items");

const pintarCarrito = () => {

    items.innerHTML = ''; //asi limpiamos cada item para que no se repita
    const template = document.querySelector("#template-carrito").content;
    const fragment = document.createDocumentFragment();

    Object.values(carrito).forEach(producto => { //transformamos nuestro objeto carrito en un array para recorrerlo
       // console.log(producto);  
        template.querySelector("th").textContent = producto.id;
        template.querySelectorAll("td")[0].textContent = producto.title;
        template.querySelectorAll("td")[1].textContent = producto.cantidad;
        template.querySelector("span").textContent = producto.precio * producto.cantidad;

        //botones + -

        template.querySelector(".btn-info").dataset.id = producto.id; //cada boton tiene su id 
        template.querySelector(".btn-danger").dataset.id = producto.id;

        const clone = template.cloneNode(true); 
        fragment.appendChild(clone); 
    });   
    
    items.appendChild(fragment);
    pintarFooter();
    accionBotones();
}

const footer = document.querySelector("#footer-carrito");

const pintarFooter = () => {
    footer.innerHTML = " ";

    if(Object.keys(carrito).length === 0){ //si tenemos 0 productos
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - Vuelve a comprar!</th>
        `
        return
    }
    const template = document.querySelector("#template-footer").content;
    const fragment = document.createDocumentFragment();
     //sumar cantidades y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad, 0); //recorremos todo el array del carrito suma el contenido que tiene el array en este caso suma toda la cantidad
    //acc + cantidad, 0  esto va sumando la cantidad al acumuladory el 0 es para que lo devuelva en numero
    //console.log(nCantidad);
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio}) => acc + cantidad * precio, 0);
    //console.log(nPrecio);
    template.querySelectorAll("td")[0].textContent = nCantidad;
    template.querySelector("span").textContent = nPrecio;

    const clone = template.cloneNode(true); 
    fragment.appendChild(clone); 
    footer.appendChild(fragment);

    const boton = document.querySelector("#vaciar-carrito");
    boton.addEventListener("click", () => {
        carrito = {}; //vaciamos el objeto
        pintarCarrito(); //actualizamos carrito
    });
}



const accionBotones = () => {
    const botonesAgregar = document.querySelectorAll("#items .btn-info");
    const botonesEliminar = document.querySelectorAll("#items .btn-danger");


    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", () => {
            
            const producto = carrito[boton.dataset.id];
            producto.cantidad ++; //aumentamos el num de los productos
            carrito[boton.dataset.id] = {...producto}; //añadimos la nueva cantidad al carrito
            pintarCarrito(); //actualizamos la nueva cantidad
        }); 
    });

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", () => {
        const producto = carrito[boton.dataset.id];
        producto.cantidad --;
        if(producto.cantidad === 0){
            delete carrito[boton.dataset.id]; //borramos el producto delete funcion solo es de los objetos
        }else{
            carrito[boton.dataset.id] = {...producto}; //añadimos la nueva cantidad al carrito
        }
       
        pintarCarrito(); 
            
        });
    });
}
