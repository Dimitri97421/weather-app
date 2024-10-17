var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
window.onload = function () {
    var mainElement = document.getElementById('main');
    mainElement.style.display = 'flex';
    var cityInput = document.getElementById('city');
    cityInput.value = "Paris"; // Définit Paris comme ville par défaut
    getWeather(); // Appelle la fonction avec Paris par défaut
};
var getWeatherButton = document.getElementById('getWeatherButton');
getWeatherButton.addEventListener('click', getWeather);
function getCoordinates(city) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://geocoding-api.open-meteo.com/v1/search?name=".concat(city);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Erreur de réseau lors de la récupération des coordonnées');
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!data.results || data.results.length === 0) {
                        throw new Error("Aucune ville trouvée. Veuillez vérifier le nom.");
                    }
                    return [2 /*return*/, {
                            latitude: data.results[0].latitude,
                            longitude: data.results[0].longitude,
                            country: data.results[0].country
                        }];
                case 4:
                    error_1 = _a.sent();
                    console.error('Erreur:', error_1);
                    throw new Error("Ville introuvable. Veuillez vérifier le nom.");
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getWeather() {
    return __awaiter(this, void 0, void 0, function () {
        var cityInput, city, weatherInfo, capitalizedCity, _a, latitude, longitude, country, apiUrl, response, data, meanTemps, weatherCodes, timezone, currentTime, todayName, todayTemp, todaySkyCondition, todaySkyImage, currentHour, weatherHtml, i, dayName, avgTemp, skyCondition, skyImage, weatherInfo, error_2, weatherInfo;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cityInput = document.getElementById('city');
                    city = cityInput.value;
                    if (!city) {
                        weatherInfo = document.getElementById('weatherInfo');
                        weatherInfo.innerText = "Veuillez entrer le nom d'une ville.";
                        return [2 /*return*/];
                    }
                    capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, getCoordinates(capitalizedCity)];
                case 2:
                    _a = _b.sent(), latitude = _a.latitude, longitude = _a.longitude, country = _a.country;
                    apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=".concat(latitude, "&longitude=").concat(longitude, "&daily=temperature_2m_mean,weathercode&timezone=auto");
                    return [4 /*yield*/, fetch(apiUrl)];
                case 3:
                    response = _b.sent();
                    if (!response.ok) {
                        throw new Error('Erreur de réseau lors de la récupération des données météo');
                    }
                    return [4 /*yield*/, response.json()];
                case 4:
                    data = _b.sent();
                    meanTemps = data.daily.temperature_2m_mean;
                    weatherCodes = data.daily.weathercode;
                    timezone = data.timezone;
                    currentTime = new Date().toLocaleString('en-US', { timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: false });
                    todayName = getDayName(0);
                    todayTemp = meanTemps[0].toFixed(1);
                    todaySkyCondition = getSkyConditionFromCode(weatherCodes[0]);
                    todaySkyImage = getSkyImageFromCode(weatherCodes[0]);
                    currentHour = parseInt(currentTime.split(':')[0]);
                    // Si l'heure est supérieure à 18h ou inférieure à 6h, change l'image pour une version de nuit
                    if (currentHour >= 18 || currentHour < 6) {
                        if (weatherCodes[0] === 0) {
                            todaySkyImage = "moon.png"; // Image d'une nuit claire
                        }
                        else if (weatherCodes[0] === 1 || weatherCodes[0] === 2) {
                            todaySkyImage = "night-mode.png"; // Image d'une nuit nuageuse
                        }
                    }
                    weatherHtml = "\n            <div class=\"today_weather\">\n                <img src=\"./images/".concat(todaySkyImage, "\" alt=\"").concat(todaySkyCondition, "\" style=\"width: 100px; height: 100px; margin-right: 20px;\">\n                <div>\n                    <h1>").concat(capitalizedCity, ", ").concat(country, "</h1>\n                    <h2>").concat(todayName, " : ").concat(todayTemp, "\u00B0C</h2>\n                    <h3>").concat(todaySkyCondition, "</h3>\n                    <h3>Heure locale : ").concat(currentTime, "</h3>\n                </div>\n            </div>\n        ");
                    // Affichage des prévisions pour les 4 prochains jours
                    weatherHtml += "<div class=\"next_days\">";
                    for (i = 1; i < 4; i++) {
                        dayName = getDayName(i);
                        avgTemp = meanTemps[i].toFixed(1);
                        skyCondition = getSkyConditionFromCode(weatherCodes[i]);
                        skyImage = getSkyImageFromCode(weatherCodes[i]);
                        weatherHtml += "\n                <div class =\"day\">\n                    <h3>".concat(dayName, "</h3>\n                    <img src=\"./images/").concat(skyImage, "\" alt=\"").concat(skyCondition, "\" style=\"width: 50px; height: 50px;\">\n                    <p>").concat(avgTemp, "\u00B0C</p>\n                </div>");
                    }
                    weatherHtml += "</div>";
                    weatherInfo = document.getElementById('weatherInfo');
                    weatherInfo.innerHTML = weatherHtml;
                    cityInput.value = ""; // Réinitialise l'input après la recherche
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    console.error('Erreur:', error_2);
                    weatherInfo = document.getElementById('weatherInfo');
                    weatherInfo.innerText = error_2.message;
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Fonction pour obtenir le nom du jour de la semaine
function getDayName(offset) {
    if (offset === 0) {
        return "Aujourd'hui";
    }
    var daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    var today = new Date();
    var targetDate = new Date(today);
    targetDate.setDate(today.getDate() + offset); // Ajoute un décalage en jours
    return daysOfWeek[targetDate.getDay()];
}
// Fonction pour convertir le code météo en description d'état du ciel
function getSkyConditionFromCode(weatherCode) {
    var weatherConditions = {
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
function getSkyImageFromCode(weatherCode) {
    var weatherImages = {
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
