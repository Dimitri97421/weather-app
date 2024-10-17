window.onload = function() {

    const mainElement = document.getElementById('main') as HTMLElement;
    mainElement.style.display = 'flex';

    const cityInput = document.getElementById('city') as HTMLInputElement;
    cityInput.value = "Paris"; // Définit Paris comme ville par défaut
    getWeather(); // Appelle la fonction avec Paris par défaut
};

const getWeatherButton = document.getElementById('getWeatherButton') as HTMLElement;
getWeatherButton.addEventListener('click', getWeather);

async function getCoordinates(city: string): Promise<{ latitude: number, longitude: number, country: string }> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur de réseau lors de la récupération des coordonnées');
        }
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error("Aucune ville trouvée. Veuillez vérifier le nom.");
        }

        return {
            latitude: data.results[0].latitude,
            longitude: data.results[0].longitude,
            country: data.results[0].country
        };
    } catch (error) {
        console.error('Erreur:', error);
        throw new Error("Ville introuvable. Veuillez vérifier le nom.");
    }
}

async function getWeather(): Promise<void> {
    const cityInput = document.getElementById('city') as HTMLInputElement;
    const city = cityInput.value;
    if (!city) {
        const weatherInfo = document.getElementById('weatherInfo') as HTMLElement;
        weatherInfo.innerText = "Veuillez entrer le nom d'une ville.";
        return;
    }

    const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    try {
        const { latitude, longitude, country } = await getCoordinates(capitalizedCity);
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_mean,weathercode&timezone=auto`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erreur de réseau lors de la récupération des données météo');
        }
        const data = await response.json();

        // Température moyenne et code météo des 5 prochains jours
        const meanTemps = data.daily.temperature_2m_mean;
        const weatherCodes = data.daily.weathercode; // Codes météo pour l'état du ciel
        const timezone = data.timezone;
        const currentTime = new Date().toLocaleString('en-US', { timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: false });

        // Affichage des prévisions pour aujourd'hui
        const todayName = getDayName(0);
        const todayTemp = meanTemps[0].toFixed(1);
        const todaySkyCondition = getSkyConditionFromCode(weatherCodes[0]);
        let todaySkyImage = getSkyImageFromCode(weatherCodes[0]);

        const currentHour = parseInt(currentTime.split(':')[0]); // Récupère l'heure

        // Si l'heure est supérieure à 18h ou inférieure à 6h, change l'image pour une version de nuit
        if (currentHour >= 18 || currentHour < 6) {
            if (weatherCodes[0] === 0) {
                todaySkyImage = "moon.png"; // Image d'une nuit claire
            } else if (weatherCodes[0] === 1 || weatherCodes[0] === 2) {
                todaySkyImage = "night-mode.png"; // Image d'une nuit nuageuse
            }
        }

        let weatherHtml = `
            <div class="today_weather">
                <img src="./images/${todaySkyImage}" alt="${todaySkyCondition}" style="width: 100px; height: 100px; margin-right: 20px;">
                <div>
                    <h1>${capitalizedCity}, ${country}</h1>
                    <h2>${todayName} : ${todayTemp}°C</h2>
                    <h3>${todaySkyCondition}</h3>
                    <h3>Heure locale : ${currentTime}</h3>
                </div>
            </div>
        `;

        // Affichage des prévisions pour les 4 prochains jours
        weatherHtml += `<div class="next_days">`;

        for (let i = 1; i < 4; i++) {
            const dayName = getDayName(i);
            const avgTemp = meanTemps[i].toFixed(1); // Température moyenne arrondie à 1 décimale
            const skyCondition = getSkyConditionFromCode(weatherCodes[i]); // État du ciel basé sur le code météo
            const skyImage = getSkyImageFromCode(weatherCodes[i]); // Image correspondant à l'état du ciel

            weatherHtml += `
                <div class ="day">
                    <h3>${dayName}</h3>
                    <img src="./images/${skyImage}" alt="${skyCondition}" style="width: 50px; height: 50px;">
                    <p>${avgTemp}°C</p>
                </div>`;
        }

        weatherHtml += `</div>`;

        const weatherInfo = document.getElementById('weatherInfo') as HTMLElement;
        weatherInfo.innerHTML = weatherHtml;
        cityInput.value = ""; // Réinitialise l'input après la recherche

    } catch (error) {
        console.error('Erreur:', error);
        const weatherInfo = document.getElementById('weatherInfo') as HTMLElement;
        weatherInfo.innerText = (error as Error).message;
    }
}

// Fonction pour obtenir le nom du jour de la semaine
function getDayName(offset: number): string {
    if (offset === 0) {
        return "Aujourd'hui";
    }
    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + offset); // Ajoute un décalage en jours
    return daysOfWeek[targetDate.getDay()];
}

// Fonction pour convertir le code météo en description d'état du ciel
function getSkyConditionFromCode(weatherCode: number): string {
    const weatherConditions: { [key: number]: string } = {
        0: "Ciel dégagé",
        1: "Partiellement dégagé",
        2: "Partiellement nuageux",
        3: "Nuageux",
        45: "Brouillard",
        48: "Brouillard givrant",
        51: "Bruine légère",
        53: "Bruine modérée",
        55: "Bruine dense",
        56: "Bruine verglaçante légère",
        57: "Bruine verglaçante dense",
        61: "Pluie légère",
        63: "Pluie modérée",
        65: "Pluie forte",
        66: "Pluie verglaçante légère",
        67: "Pluie verglaçante forte",
        71: "Neige légère",
        73: "Neige modérée",
        75: "Neige forte",
        77: "Grains de neige",
        80: "Averses légères",
        81: "Averses modérées",
        82: "Averses fortes",
        85: "Averses de neige légères",
        86: "Averses de neige fortes",
        95: "Orages légers ou modérés",
        96: "Orages avec grêle légère",
        99: "Orages avec grêle forte"
    };

    return weatherConditions[weatherCode] || "Inconnu";
}

// Fonction pour obtenir le chemin de l'image correspondant à l'état du ciel
function getSkyImageFromCode(weatherCode: number): string {
    const weatherImages: { [key: number]: string } = {
        0: "sunny.png",
        1: "sunny.png",
        2: "clear-sky.png",
        3: "clouds.png",
        45: "fog.png",
        48: "fog.png",
        51: "rain.png",
        53: "rain.png",
        55: "rain.png",
        56: "rain.png",
        57: "rain.png",
        61: "rain.png",
        63: "rainy.png",
        65: "rainy.png",
        66: "rain.png",
        67: "rainy.png",
        71: "snow.png",
        73: "snow.png",
        75: "snow.png",
        77: "snow.png",
        80: "rain.png",
        81: "rainy.png",
        82: "rainy.png",
        85: "snow.png",
        86: "snow.png",
        95: "thunderstorm.png",
        96: "thunderstorm.png",
        99: "thunderstorm.png"
    };

    return weatherImages[weatherCode] || "";
}