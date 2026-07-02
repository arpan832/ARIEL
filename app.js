const greet = document.getElementById("greet");
const clock = document.getElementById("clock");

function updateTime() {
    const now = new Date();
    const hour = now.getHours();

    clock.textContent = now.toLocaleTimeString();

    if (hour < 12) {
        greet.textContent = "Good Morning";
    } else if (hour < 18) {
        greet.textContent = "Good Afternoon";
    } else {
        greet.textContent = "Good Evening";
    }
}

updateTime();
setInterval(updateTime, 1000);

function loadApps() {
    const appgrid = document.getElementById("app-grid");

    try {
        const responsedata = [
            { name: "GitHub", url: "https://github.com", pic: "https://github.githubassets.com/favicons/favicon.png" },
            { name: "YouTube", url: "https://youtube.com", pic: "https://www.youtube.com/s/desktop/12d6b690/img/favicon_144x144.png" },
            { name: "Vercel", url: "https://vercel.com", pic: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" }
        ];

        appgrid.innerHTML = "";

        responsedata.forEach(app => {
            const card = document.createElement("div");
            card.className = "app-card";
            card.onclick = () => {
                window.location.href = app.url;
            };

            const img = document.createElement("img");
            img.src = app.pic;
            img.alt = `${app.name} Icon`;
            img.className = "app-icon";

            const label = document.createElement("span");
            label.className = "app-name";
            label.innerText = app.name;

            card.appendChild(img);
            card.appendChild(label);
            appgrid.appendChild(card);
        });
    } catch (error) {
        console.error("failed to open the api", error);
        appgrid.innerHTML = '<span style="color: red;">failed to load apps.</span>';
    }
}

loadApps();

const apikey = "cJpzYFpWIN0zzTnG9LnrbY7yGsnFmoJ1fVfipRlt";
const url = `https://api.nasa.gov/planetary/apod?api_key=${apikey}`;
const fallbackBackgrounds = [
    "https://images-assets.nasa.gov/image/PIA03654/PIA03654~orig.jpg",
    "https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg",
    "https://images-assets.nasa.gov/image/PIA09178/PIA09178~orig.jpg"
];

function setBackgroundImage(imageUrl) {
    document.body.style.backgroundImage = `linear-gradient(rgba(7, 10, 18, 0.45), rgba(7, 10, 18, 0.45)), url("${imageUrl}")`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
}

function setFallbackBackground() {
    const today = new Date().getDate();
    const image = fallbackBackgrounds[today % fallbackBackgrounds.length];
    setBackgroundImage(image);
}

async function loadNasaBackground() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        setFallbackBackground();

        const response = await fetch(url, {
            cache: "no-store",
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`NASA API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.media_type === "image") {
            const imageUrl = (data.hdurl || data.url).replace(/^http:\/\//, "https://");
            setBackgroundImage(imageUrl);
        } else {
            console.log("NASA APOD is not an image today:", data.url);
        }
    } catch (error) {
        console.error("Failed to fetch NASA image", error);
    } finally {
        clearTimeout(timeout);
    }
}

loadNasaBackground();
