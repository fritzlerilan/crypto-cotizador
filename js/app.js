const criptomonedaSelect = document.querySelector('#criptomonedas');

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();
})

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'
    fetch(url)
        .then(response => response.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
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