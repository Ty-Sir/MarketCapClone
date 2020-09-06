const BASE_URL = "https://api.coingecko.com/api/v3";
const MARKET_URL = "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d";
const GLOBAL = "/global";
const ALL_EXCHANGES = "/exchanges/list";

async function refreshTable() {
  const [dataHome, data, exData] = await Promise.all([getData(), getGlobal(), getEx()]);
  buildTopRow(data, exData);
  buildTable(dataHome);
}
refreshTable().catch(err => console.log(err));

function getData() {
  let marketList = BASE_URL + MARKET_URL;
  return fetch(marketList)
  .then(function(res){
    return res.json()
  })
  .then(function(dataHome){
    console.log(dataHome);
    return dataHome;
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

// HOME PAGE
function buildTable(dataHome) {
  for (i = 0; i < dataHome.length; i++){

    let rank = dataHome[i].market_cap_rank;
    let logo = dataHome[i].image;
    let name = dataHome[i].name;
    let ticker = dataHome[i].symbol;
    let price = dataHome[i].current_price;
    let hour = dataHome[i].price_change_percentage_1h_in_currency;
    let day = dataHome[i].price_change_percentage_24h_in_currency;
    let sevenDay = dataHome[i].price_change_percentage_7d_in_currency;
    let volume = dataHome[i].total_volume;
    let marketCap = dataHome[i].market_cap;
    let low24 = dataHome[i].low_24h;
    let high24 = dataHome[i].high_24h;
    let circulating = dataHome[i].circulating_supply;

    let supply = dataHome[i].total_supply;

    supply === null ? supply = "&infin;" : supply;

    function gainLoss(percentage) {
      if (typeof percentage !== 'number') return '';
      else if (percentage >= 0) return 'gain';
      else return 'loss';
    }

    let cell1 = '<td/ class="rank">' + rank;
    let cell2 = '<td/ class="name ticker text-left">' +'<img alt="' + name + ' logo" class="logo" src="' + logo + '">' +'<a/ href="https://www.google.com/search?q= ' + name + ' cryptocurrency" target="_blank">' + name;
    let cell3 = '<td/ class="ticker">' + ticker;
    let cell4 = '<td/ class="price text-right">' + numFt.usd.format(price) + '<p/ class="highLow high">' + "24h high " + numFt.usd.format(high24) + '<p/ class="highLow low">' + "24h low " + numFt.usd.format(low24);
    let cell5 = `<td/ class="hour ${gainLoss(hour)}">${typeof hour === 'number' ? hour.toFixed(1) + '%' : 'N/A'}`;
    let cell6 = `<td/ class="day ${gainLoss(day)}">${typeof day === 'number' ? day.toFixed(1) + '%' : 'N/A'}`;
    let cell7 = `<td/ class="sevenDay ${gainLoss(sevenDay)}">${typeof sevenDay === 'number' ? sevenDay.toFixed(1) + '%' : 'N/A'}`;
    let cell8 = '<td/ class="volume text-right">' + numFt.usd0.format(volume);
    let cell9 = '<td/ class="marketCap text-right">'  + numFt.usd0.format(marketCap);
    let cell10 = '<td/ class="circulating text-right">' + numFt.addCommas.format(circulating);
    let cell11 = '<td/ class="supply text-right">' + (typeof supply === 'number' ? numFt.addCommas.format(supply) : supply);

    let row = '<tr/>' + cell1 + cell2 + cell3 + cell4 + cell5 + cell6 + cell7 + cell8 + cell9 + cell10 + cell11;

    $("tbody").append(row);
  };

  searchBarFilter();
  sortTableByColumn();
};
