const BASE_URL = "https://api.coingecko.com/api/v3";
const ALL_EXCHANGES = "/exchanges/list";
const GLOBAL = "/global";

async function refreshTable() {
  const [exData, data] = await Promise.all([getData(), getGlobal()]);
  buildTopRow(data, exData); // calls function located in helper.js
  buildExTable(exData);
}
refreshTable().catch(err => console.log(err));

function getData() {
  let allExchanges = BASE_URL + ALL_EXCHANGES;
  return fetch(allExchanges)
  .then(res => res.json())
  .then(exData => {
    console.log(exData);
    return exData;
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

function buildExTable(exData) {

  for (let exchange of exData) {
    let exName = exchange.name;
    let cell1 = '<td/ class="name">' + '<a/ href="https://www.google.com/search?q= '+ exName +' crypto exchange" target="_blank">' + exName;
    let row = '<tr/>' + cell1;
    $("tbody").append(row);
  };
  searchBarFilter();
};
