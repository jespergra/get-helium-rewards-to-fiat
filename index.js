import fetch from 'node-fetch';
(async () => {

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const yyyy = today.getFullYear();

    // Preferbly run this script before next day to get an accurate 24h value
    today = `${yyyy}-${mm}-${dd}`;
    const hotspotAddress = "YOUR-HOTSPOT-ADDRESS";
    const coinmarketcapApiKey = "YOUR-API-KEY";


    // No API-key required. You just need your hotspot address
    const res = await fetch(`https://api.helium.io/v1/hotspots/${hotspotAddress}/rewards/sum?min_time=${today}`);
    if (!res.ok) {
    throw new Error(res.statusText);
    }

    const body = await res.json();

    const hntEarned = body.data.total;

    // Change convert to yor currency of choice
    const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=helium&convert=SEK', {
        method: 'GET',
        headers: {
        'X-CMC_PRO_API_KEY': coinmarketcapApiKey,
        }
    });
    const tbody = await response.json(); 
    // 5665 is the Helium ID
    const hntPriceInSEK = tbody.data[5665].quote.SEK.price;
    const earningsInSEK = hntEarned*hntPriceInSEK;
    // Round earnings
    const roundedEarnings = Math.round(earningsInSEK * 100) / 100;
    console.log(roundedEarnings);

    return roundedEarnings;

})().catch(err => {
    console.error(err);
});


