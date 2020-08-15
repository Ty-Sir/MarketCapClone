let BASE_URL="https://api.coingecko.com/api/v3";
let MARKET_URL="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d";

let marketList = BASE_URL + MARKET_URL;



let coins = [marketList]; //will add more urls to get 24h volume

Promise.all(coins.map(urls => {
  return fetch(urls).then(res =>
    res.json())
}))
.then(data => {
  console.log(data);

    for (i = 0; i < data[0].length; i++){

      let rank = data[0][i].market_cap_rank;
      let logo = data[0][i].image;
      let name = data[0][i].name;
      let ticker = data[0][i].symbol;
      let price = data[0][i].current_price;
      let hour = data[0][i].price_change_percentage_1h_in_currency;
      let day = data[0][i].price_change_percentage_24h_in_currency;
      let sevenDay = data[0][i].price_change_percentage_7d_in_currency;
      let volume = data[0][i].total_volume;
      let marketCap = data[0][i].market_cap;
      let low24 = data[0][i].low_24h;
      let high24 = data[0][i].high_24h;
      let chartData = data[0][i].sparkline_in_7d.price;

      let hourGainLoss = hour >= 0  ? addClass = "gain" : addClass = "loss";
      let dayGainLoss = day >= 0  ? addClass = "gain" : addClass = "loss";
      let sevenDayGainLoss = sevenDay >= 0  ? addClass = "gain" : addClass = "loss";

      let cell1 = '<td/ class="rank">' + rank;

      let cell2 = '<td/ class="name ticker text-left">' + '<img alt="' + name + ' logo" class="logo" src="' + logo + '">' + ' ' + name;
      let cell3 = '<td/ class="ticker">' + ticker;
      let cell4 = '<td/ class="price text-right">' + "$" + price;
      let cell5 = '<td/ class="hour '+ hourGainLoss + '">' + parseFloat(hour || 0).toFixed(1) + "%";
      let cell6 = '<td/ class="day '+ dayGainLoss + '">' + parseFloat(day || 0).toFixed(1) + "%";
      let cell7 = '<td/ class="sevenDay '+ sevenDayGainLoss + '">' + parseFloat(sevenDay || 0).toFixed(1) + "%";
      let cell8 = '<td/ class="volume text-right">' + "$" + volume;
      let cell9 = '<td/ class="marketCap text-right">' + "$" + marketCap;

      let row = '<tr/>' + cell1 + cell2 + cell3 + cell4 + cell5 + cell6 + cell7 + cell8 + cell9;

      $("tbody").append(row);
    };

      function sortTable(table, column, asc = true){
        const dirModifier = asc ? 1 : -1;
        const tBody = table.tBodies[0];
        const rows = Array.from(tBody.querySelectorAll("tr"));
          //sort each rows
        const sortedRows = rows.sort((a, b) => {
        if (column !== 1){
          const aColPrice = parseFloat(a.querySelector(`td:nth-child(${column + 1})`).textContent.trim().replace('$',""));
          const bColPrice = parseFloat(b.querySelector(`td:nth-child(${column + 1})`).textContent.trim().replace('$',""));
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
        //readd newly sortable rows
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
.catch (err =>{
  console.log(err);
});
