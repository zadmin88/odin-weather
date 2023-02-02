const APIKey = `d4424addfe2ca4624d12ac46f2b2d667`

const form = document.querySelector('form')

const getSiteLatLong = async (name) => {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${name}&appid=${APIKey}`
  )
  const data = await response.json()

  return { lat: data[0].lat, lon: data[0].lon }
}

const getData = async (lat, lon, APIKey) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`
  )
  const data = await response.json()
  return data
}

const selectData = (data) => {
  return {
    name: data.name,
    country: data.sys.country,
    sunrise: new Date(data.sys.sunrise).toISOString().slice(11, 19),
    sunset: new Date(data.sys.sunset).toISOString().slice(11, 19),
    feels_like: data.main.feels_like,
    humidity: data.main.humidity,
    temp: data.main.temp,
    clouds: data.clouds.all,
  }
}

const showData = (data) => {
  const carDiv = document.querySelector('.card')

  const location = document.createElement('h2')
  location.classList.add('location')
  location.textContent = `${data.name}, ${data.country}`

  const sunIcon = document.createElement('img')
  if (data.clouds < 30) {
    sunIcon.src = './images/clear-day.svg'
  } else if (data.clouds > 30 && data.clouds < 50) {
    sunIcon.src = './images/partly-cloudy-day.svg'
  } else if (data.clouds > 50 && data.clouds < 70) {
    sunIcon.src = './images/cloudy.svg'
  } else if (data.clouds > 70) {
    sunIcon.src = './images/overcast.svg'
  }

  const temp = document.createElement('h3')
  temp.classList.add('temp')
  temp.textContent = `${data.temp}°C`

  const perceptionDiv = document.createElement('div')
  perceptionDiv.classList.add('perception')
  const feel = document.createElement('p')
  const humidity = document.createElement('p')
  const clouds = document.createElement('p')

  humidity.textContent = `humidity: ${data.humidity}% | `
  clouds.textContent = `Clouds: ${data.clouds}% `
  feel.textContent = `Feels Like: ${data.feels_like}°C | `

  perceptionDiv.appendChild(feel)
  perceptionDiv.appendChild(humidity)
  perceptionDiv.appendChild(clouds)

  const sunDiv = document.createElement('div')
  sunDiv.classList.add('sunDiv')
  const sunText = document.createElement('p')
  sunText.textContent = `Sunrise: ${data.sunrise} | Sunset: ${data.sunset}`

  sunDiv.appendChild(sunText)

  carDiv.appendChild(location)
  carDiv.appendChild(sunIcon)
  carDiv.appendChild(temp)
  carDiv.appendChild(perceptionDiv)
  carDiv.appendChild(sunDiv)
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const carDiv = document.querySelector('.card')
  carDiv.innerHTML = 'Loading...'
  const formData = new FormData(form)
  const city = `${formData.get('city')}`
  getSiteLatLong(city)
    .then(async (data) => {
      try {
        const datas = await getData(data.lat, data.lon, APIKey)
        carDiv.innerHTML = ''
        showData(selectData(datas))
      } catch (err) {
        carDiv.innerHTML = 'No data was found'
      }
    })
    .catch((err) => {
      carDiv.innerHTML = 'No data was found'
    })
  form.reset()
})

getSiteLatLong('boston').then(async (data) => {
  const datas = await getData(data.lat, data.lon, APIKey)
  showData(selectData(datas))
})

// getData({ lat, lon }, APIKey)

// const getData = (city, APIKey) => {
//   const response = fetch(
//     `https://api.openweathermap.org/data/2.5/forecast/daily?lat=44.34&lon=10.99&cnt=7&appid=${APIKey}`
//     // `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${APIKey}`
//   )

//   Promise.resolve(response)
//     .then((response) => {
//       return response.json()
//     })
//     .then((data) => {
//       console.log(data)
//     })
// }
