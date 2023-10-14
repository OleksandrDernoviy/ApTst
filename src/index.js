// X-Content-Type-Options: nosniff
import './sass/styles.css'

const refs = {
  form: document.querySelector(".js-search-form "),
  list: document.querySelector(".js-list"),
};

refs.form.addEventListener("submit", handleSearch);

function handleSearch(event) {
  event.preventDefault();

  const { city, days } = event.currentTarget.elements; // витягаємо з полів форми посилання на інпут для міста і селект для днів

  serviceWeather(city.value, days.value) // викликаємо сервіс для запиту на сервер і передаємо відповідну інформацію
    .then((data) => {
      refs.list.innerHTML = createMarkup(data.forecast.forecastday); // створюємо розмітку і записуємо її у ul
    })
    .catch((err) => console.log(err)) // ловимо помилку за межами фунції
    .finally(() => refs.form.reset()); // очищуємо поля форми після відповіді від сервера
}

function serviceWeather(city, days) {
  const BASE_URL = "http://api.weatherapi.com/v1";
  const API_KEY = "8139685a465a481bb41105758232809";

  // створюємо параметри запиту за допомогою класу URLSearchParams, де у вигляді обʼєкту зручно описуємо параметри, замість того, щоб писати їх в строці
  const params = new URLSearchParams({
    key: API_KEY,
    q: city,
    days,
    lang: "uk",
  });
  //    fetch(
  //     `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}&lang=uk`
  //     )
  return fetch(`${BASE_URL}/forecast.json?${params}`).then((response) => {
    // якщо ok === false - вручну викидуємо помилку (наприклад, коли статус 404)
    if (!response.ok) {
      throw new Error(
        `Вимушена помилка статусу: ${response.status} | Причина: ${response.statusText}`
      );
    }

    return response.json();
  });
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        date,
        day: {
          avgtemp_c,
          condition: { text, icon },
        },
      }) => `<li class="weather-card">
        <img src="${icon}" alt="${text}" class="weather-icon">
        <h2 class="date">${date}</h2>
        <h3 class="weather-text">${text}</h3>
        <h3 class="temperature">${avgtemp_c} °C</h3>
    </li>
      `
    )
    .join("");
}
