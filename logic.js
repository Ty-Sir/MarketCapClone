let BASE_URL="https://api.coingecko.com/api/v3";
let MARKET_URL="/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d";

let marketList = BASE_URL + MARKET_URL;

const formatter = new Intl.NumberFormat("en-US",{
  style: "currency",
  currency: "USD",
  maximumSignificantDigits: 17
});

let coins = [marketList]; //will add more urls to get 24h volume

Promise.all(coins.map(urls => {
  return fetch(urls).then(res =>
    res.json())
}))
.then(data => {
  console.log(data);

    for (i = 0; i < data[0].length; i++){

      let rank = data[0][i].market_cap_rank;
      let name = data[0][i].name;
      let ticker = data[0][i].symbol;
      let price = formatter.format(data[0][i].current_price);
      let hour = data[0][i].price_change_percentage_1h_in_currency;
      let day = data[0][i].price_change_percentage_24h_in_currency;
      let sevenDay = data[0][i].price_change_percentage_7d_in_currency;
      let volume = formatter.format(data[0][i].total_volume);
      let marketCap = formatter.format(data[0][i].market_cap);

      let hourGainLoss = hour >= 0  ? addClass = "gain" : addClass = "loss";
      let dayGainLoss = day >= 0  ? addClass = "gain" : addClass = "loss";
      let sevenDayGainLoss = sevenDay >= 0  ? addClass = "gain" : addClass = "loss";

      let cell1 = '<td/ class="rank">' + rank;
      let cell2 = '<td/ class="name text-left">' + name;
      let cell3 = '<td/ class="ticker">' + ticker;
      let cell4 = '<td/ class="price text-right">' + price;
      let cell5 = '<td/ class="hour '+ hourGainLoss + '">' + parseFloat(hour || 0).toFixed(1) + "%";
      let cell6 = '<td/ class="day '+ dayGainLoss + '">' + parseFloat(day || 0).toFixed(1) + "%";
      let cell7 = '<td/ class="sevenDay '+ sevenDayGainLoss + '">' + parseFloat(sevenDay || 0).toFixed(1) + "%";
      let cell8 = '<td/ class="volume text-right">' + volume;
      let cell9 = '<td/ class="marketCap text-right">' + marketCap;

      let row = "<tr/>" + cell1 + cell2 + cell3 + cell4 + cell5 + cell6 + cell7 + cell8 + cell9;

      $("tbody").append(row);
  };
})
.catch (err =>{
  $("header").html(err);
});
