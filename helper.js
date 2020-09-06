const numFt = {
  usd: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 8
  }),

  usd0: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }),

  addCommas: new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  })
};

function buildTopRow(data, exData) {
  let coinList =  '<a/ href="coinList.html">' + data.data.active_cryptocurrencies;

  let exchangeList = '<a/ href="exchanges.html">' + exData.length;

  let usdCap = numFt.usd0.format(data.data.total_market_cap.usd.toFixed(0));
  let usdVol = numFt.usd0.format(data.data.total_volume.usd.toFixed(0));
  let btcDom = data.data.market_cap_percentage.btc.toFixed(1) + "%";
  let ethDom = data.data.market_cap_percentage.eth.toFixed(1) + "%";

  $("#allCoins").append(coinList);
  $("#allExchanges").append(exchangeList);
  $("#usdCap").append(usdCap);
  $("#usdVol").append(usdVol);
  $("#dom").append("BTC " + btcDom + " ETH " + ethDom);
};

function searchBarFilter() {
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#searchTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
};

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

function sortTableByColumn() {
  document.querySelectorAll(".table-sortable .clickable").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
      const tableElement = headerCell.parentElement.parentElement.parentElement;
      const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
      const currentIsAsc = headerCell.classList.contains("th-sort-asc");

      sortTable(tableElement, headerIndex, !currentIsAsc);
    });
  });
};
