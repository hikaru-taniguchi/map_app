let map;

const WEATHER_API_KEY = "0e7d85fae93411b2a3b0d5642fdbeb5c";

async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.0618, lng: 141.3545 },
    zoom: 7,
  });

  const response = await fetch("data.json");
  const towns = await response.json();

  for (const town of towns) {
    const marker = new google.maps.Marker({
      position: {
        lat: Number(town.lat),
        lng: Number(town.lng),
      },
      map: map,
      title: town.name,
    });

    let weatherHtml = "<p>天気情報を取得できませんでした。</p>";

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${town.lat}&lon=${town.lng}&appid=${WEATHER_API_KEY}&lang=ja&units=metric`
      );

      const weatherData = await weatherRes.json();

      if (weatherData.weather && weatherData.main) {
        const icon = weatherData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        weatherHtml = `
          <hr>
          <p><b>現在の天気：</b> ${weatherData.weather[0].description}</p>
          <img src="${iconUrl}" alt="天気アイコン" style="width:50px;height:50px;">
          <p>🌡 ${weatherData.main.temp.toFixed(1)}℃</p>
        `;
      }
    } catch (error) {
      console.log("天気取得エラー:", error);
    }

    const info = new google.maps.InfoWindow({
      content: `
        <div style="text-align:center;">
          <h3>${town.name}</h3>
          <img src="${town.img}" style="width:150px; height:auto; border-radius:8px;"><br>
          <p>${town.desc}</p>
          <a href="${town.url}" target="_blank">▶ 公式サイトを見る</a>
          ${weatherHtml}
        </div>
      `,
    });

    marker.addListener("click", () => {
      info.open(map, marker);
    });
  }
}

window.initMap = initMap;
