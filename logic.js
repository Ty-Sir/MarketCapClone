const BASE_URL = "https://api.coingecko.com/api/v3";
const MARKET_URL = "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d";
const ALL_COINS = "/coins/list";
const ALL_EXCHANGES = "/exchanges/list";
const GLOBAL = "/global";

let marketList = BASE_URL + MARKET_URL;
let allCoins = BASE_URL + ALL_COINS;
let allExchanges = BASE_URL + ALL_EXCHANGES;
let globalData = BASE_URL + GLOBAL;

let usd = new Intl.NumberFormat('en-US',{
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 18
});

function addCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

let homeData = marketList;

let coins = [allCoins, allExchanges, globalData];

fetch(marketList)
.then(function(res){
  res.json().then(function(dataHome){
    console.log(dataHome)

      //home page
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
        let supply = Math.round(dataHome[i].total_supply);

        function buildTable(){
          let hourGainLoss = hour >= 0  ? addClass = "gain" : addClass = "loss";
          let dayGainLoss = day >= 0  ? addClass = "gain" : addClass = "loss";
          let sevenDayGainLoss = sevenDay >= 0  ? addClass = "gain" : addClass = "loss";
          supply === 0 ? supply = "&infin;" : supply;

          let cell1 = '<td/ class="rank">' + rank;
          let cell2 = '<td/ class="name ticker text-left">' +'<img alt="' + name + ' logo" class="logo" src="' + logo + '">' +'<a/ href="https://www.google.com/search?q= ' + name + ' cryptocurrency" target="_blank">' + name;
          let cell3 = '<td/ class="ticker">' + ticker;
          let cell4 = '<td/ class="price text-right">' + usd.format(price) + '<p/ class="text-right highLow high">' + "24h high " + usd.format(high24) + '<p/ class="text-right highLow low">' + "24h low " + usd.format(low24);
          let cell5 = '<td/ class="hour '+ hourGainLoss + '">' + parseFloat(hour || 0).toFixed(1) + "%";
          let cell6 = '<td/ class="day '+ dayGainLoss + '">' + parseFloat(day || 0).toFixed(1) + "%";
          let cell7 = '<td/ class="sevenDay '+ sevenDayGainLoss + '">' + parseFloat(sevenDay || 0).toFixed(1) + "%";
          let cell8 = '<td/ class="volume text-right">' + usd.format(volume);
          let cell9 = '<td/ class="marketCap text-right">'  + usd.format(marketCap);
          let cell10 = '<td/ class="circulating text-right">' + addCommas(circulating.toFixed(0));
          let cell11 = '<td/ class="supply text-right">' + addCommas(supply);

          let row = '<tr/>' + cell1 + cell2 + cell3 + cell4 + cell5 + cell6 + cell7 + cell8 + cell9 + cell10 + cell11;

          $("tbody.tableOne").append(row);
        };
        buildTable();
      };

      //search bar homepage
        $(document).ready(function(){
          $("#myInput1").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $("#searchTable1 tr").filter(function() {
              $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
          });
        });

      //TABLE SORTER--heavily helped by a video to reach this function//cant get jquery to work with it
      function sortTable(table, column, asc = true){
        const dirModifier = asc ? 1 : -1;
        const tBody = table.tBodies[0];
        const rows = Array.from(tBody.querySelectorAll("tr"));
          //sort each rows
        const sortedRows = rows.sort((a, b) => {
        if (column !== 1){
          const aColPrice = parseFloat((a.querySelector(`td:nth-child(${column + 1})`)).textContent.trim().replace("$",'').replace(/,/g,""));
          const bColPrice = parseFloat((b.querySelector(`td:nth-child(${column + 1})`)).textContent.trim().replace("$",'').replace(/,/g,""));
            return aColPrice > bColPrice ? (1 * dirModifier) : (-1 * dirModifier);
        }  else {
            const aColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
            const bColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
              return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
        }});
        //remove all existing trs from the table
        while (tBody.firstChild) {
          tBody.removeChild(tBody.firstChild);
        }
        //read newly sortable rows
        tBody.append(...sortedRows);
        //remember which columm is sorting
        table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
        table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
        table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
      };

      document.querySelectorAll(".table-sortable .clickable").forEach(headerCell => {
        headerCell.addEventListener("click", () => {
          const tableElement = headerCell.parentElement.parentElement.parentElement;
          const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
          const currentIsAsc = headerCell.classList.contains("th-sort-asc");

          sortTable(tableElement, headerIndex, !currentIsAsc);
        });
      });
  })
})
.catch (err =>{
  console.log(err);
});



Promise.all(coins.map(urls => {
  return fetch(urls).then(res =>
    res.json())
  }))
.then(data => {
  console.log(data);
    //top row data
    let usdCap = usd.format(data[2].data.total_market_cap.usd.toFixed(0));
      $("#usdCap").append(usdCap);
    let usdVol = usd.format(data[2].data.total_volume.usd.toFixed(0));
      $("#usdVol").append(usdVol);
    let btcDom = data[2].data.market_cap_percentage.btc.toFixed(1) + "%";
    let ethDom = data[2].data.market_cap_percentage.eth.toFixed(1) + "%";
      $("#dom").append("BTC " + btcDom + " ETH " + ethDom);


    //all coins page
    for (c = 0; c < data[0].length; c++){
      let name2 = data[0][c].name;
      let ticker2 = data[0][c].symbol;

      function buildAllCoinTable() {
        let cell1Table2 = '<td/ class="name">' + '<a/ href="https://www.google.com/search?q= '+ name2 +' cryptocurrency" target="_blank">' + name2;
        let cell2Table2 = '<td/ class="ticker">' + ticker2;
        let rowTable2 = '<tr/>' + cell1Table2 + cell2Table2;

        $("tbody.tableTwo").append(rowTable2);
      };
      buildAllCoinTable();
    };
    //all coins search bar
      $(document).ready(function(){
        $("#myInput2").on("keyup", function() {
          var value = $(this).val().toLowerCase();
          $("#searchTable2 tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
        });
      });
    let coinList =  '<a/ href="coinList.html">' + data[0].length;
      $("#allCoins").append(coinList);


    //all exchanges page
    for (x = 0; x < data[1].length; x++){
      let exName = data[1][x].name;

      function buildExTable(){
          let cell1Table3 = '<td/ class="name">' + '<a/ href="https://www.google.com/search?q= '+ exName +' crypto exchange" target="_blank">' + exName;
          let rowTable3 = '<tr/>' + cell1Table3;
          $("tbody.tableThree").append(rowTable3);
        };
      buildExTable();
    };
    //all exchanges search bar
      $(document).ready(function(){
        $("#myInput3").on("keyup", function() {
          var value = $(this).val().toLowerCase();
          $("#searchTable3 tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
        });
      });
    let exchangeList = '<a/ href="exchanges.html">' + data[1].length;
      $("#allExchanges").append(exchangeList);
})
.catch (err =>{
  console.log(err);
});
