const criptomonedaSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {moneda: '', criptomoneda: ''};


document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);
    criptomonedaSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})

async function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'
    try {
        const response = await fetch(url);
        const resultado = await response.json()
        const criptomonedas = await obtenerCriptomonedas(resultado.Data)
        selectCriptomonedas(criptomonedas)
    } catch (error) {
        console.error(error);
    }

}


function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {

        const { FullName, Name } = cripto.CoinInfo;
        const opcion = document.createElement('option');
        opcion.value = Name;
        opcion.textContent = FullName;
        criptomonedaSelect.appendChild(opcion);

    })
}

function submitFormulario(e){
    e.preventDefault();

    const {moneda, criptomoneda} = objBusqueda;
    if( moneda === '' || criptomoneda === '' ){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar API
    consultarApi();
}

async function consultarApi() {
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner();
        
    try {
        const response = await fetch(url);
        const data = await response.json();
        mostrarCotizacionHTML(data.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.error(error);
    }

}

function mostrarCotizacionHTML(cotizacion) {
    limpiarResultado();
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>El precio mas alto del d??a: <span>${HIGHDAY}</span></p>`

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>El precio mas bajo del d??a: <span>${LOWDAY}</span></p>`

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variacion ??ltimas 24hs: <span>${CHANGEPCT24HOUR} %</span></p>`

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML =`<p>ACTUALIZADO: <span>${LASTUPDATE}</span></p>`


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);

}

function limpiarResultado() {
    while(resultado.hasChildNodes()){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarAlerta(msg) {
    
    if(!document.querySelector('.error')){
        divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        divMensaje.textContent = msg;
        
        formulario.appendChild(divMensaje);
        
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

}

function mostrarSpinner(){
    limpiarResultado();

    const spinner = document.createElement('div');
    spinner.classList.add('sk-folding-cube');
    spinner.innerHTML = `
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
    `
    resultado.appendChild(spinner);
}