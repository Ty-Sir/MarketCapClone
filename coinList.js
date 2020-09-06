// coinList.js

const BASE_URL = "https://api.coingecko.com/api/v3";
const ALL_COINS = "/coins/list";
const GLOBAL = "/global";
const ALL_EXCHANGES = "/exchanges/list";

async function refreshTable() {
  const [coinData, data, exData] = await Promise.all([getData(), getGlobal(), getEx()]);
  buildTopRow(data, exData);
  buildAllCoinTable(coinData);
}
refreshTable().catch(err => console.log(err));

function getData() {
  let allCoins = BASE_URL + ALL_COINS;
  return fetch(allCoins)
  .then(res => res.json())
  .then(coinData => {
    console.log(coinData);
    return coinData;
  });
};

function getGlobal() {
  let globalData = BASE_URL + GLOBAL;
  return fetch(globalData)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    return data;
  });
};

function getEx() {
  let allExchanges = BASE_URL + ALL_EXCHANGES;
  return fetch(allExchanges)
  .then(res => res.json())
  .then(exData => {
    console.log(exData);
    return exData;
  });
};

function buildAllCoinTable(coinData) {
  for (let coin of coinData) {
    let name = coin.name;
    let ticker = coin.symbol;

    let cell1 = '<td/ class="name">' + '<a/ href="https://www.google.com/search?q= '+ name +' cryptocurrency" target="_blank">' + name;
    let cell2 = '<td/ class="ticker">' + ticker;

    let row = '<tr/>' + cell1 + cell2;
    $("tbody").append(row);
  };
  searchBarFilter();
};
