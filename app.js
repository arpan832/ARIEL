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

const widgetFallbackImages = [  //this is for the fallback images if the api fails to load
    {
        title: "Earth From Apollo 17",
        src: "https://images-assets.nasa.gov/image/AS17-148-22727/AS17-148-22727~orig.jpg"
    },
    {
        title: "Jupiter Great Red Spot",
        src: "https://images-assets.nasa.gov/image/PIA21775/PIA21775~orig.jpg"
    },
    {
        title: "Pillars of Creation",
        src: "https://images-assets.nasa.gov/image/PIA09178/PIA09178~orig.jpg"
    },
    {
        title: "Saturn From Cassini",
        src: "https://images-assets.nasa.gov/image/PIA11141/PIA11141~orig.jpg"
    },
    {
        title: "The Andromeda Galaxy",
        src: "https://images-assets.nasa.gov/image/PIA04921/PIA04921~orig.jpg"
    },
    {
        title: "Mars Curiosity Rover",
        src: "https://images-assets.nasa.gov/image/PIA16937/PIA16937~orig.jpg"
    },
    {
        title: "Orion Nebula",
        src: "https://images-assets.nasa.gov/image/PIA08653/PIA08653~orig.jpg"
    },
    {
        title: "Moon Over Earth",
        src: "https://images-assets.nasa.gov/image/PIA00342/PIA00342~orig.jpg"
    }
];

async function fetchWidgetImages() {     // here we fetch the images 
    try {
        const response = await fetch(`${url}&count=12`, {   // this waits for the api to fetch
            cache: "no-store"
        });

        if (!response.ok) { // if the api failed to load it will throw an error
            throw new Error(`NASA widget API error: ${response.status}`);
        }

        const data = await response.json();// converts the data into a json() format 
        const images = data   // Declares a variable to the data 
            .filter(item => item.media_type === "image" && (item.hdurl || item.url)) // now we will filter out the pic and the caption from the api
            .map(item => {
                return {
                    title: item.title,// and map them so that we can use them 
                    src: (item.hdurl || item.url).replace(/^http:\/\//, "https://")
                };
            });

        return images.length > 0 ? images : widgetFallbackImages; // if the images fails to load it will call the widgetFallbackimages
    } catch (error) {
        console.error("Failed to fetch NASA widget images", error); //  or else this is the same 
        return widgetFallbackImages;
    }
}

function shuffle(array) {   // Fisher yates shuffle 
    let currentIndex = array.length;

    while (currentIndex > 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);//to randomize a number 
        currentIndex--; // this decreases the current index 

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],// this thing swap the indesecs
            array[currentIndex]
        ];
    }

    return array; // returns an array 
}

function startInfiniteSlideshow() {
    const imgElement = document.getElementById("widget-image");// grabbed the element 
    const captionElement = document.querySelector(".widget-caption");
    let shuffledImages = shuffle([...widgetFallbackImages]);
    let currentIndex = 0;

    function changeImage() { // here we are changing the img
        if (currentIndex >= shuffledImages.length) {
            shuffledImages = shuffle([...shuffledImages]);
            currentIndex = 0;
        }

        const currentImage = shuffledImages[currentIndex];
        imgElement.src = currentImage.src;
        imgElement.alt = currentImage.title;
        captionElement.textContent = currentImage.title;
        currentIndex++;
    }

    changeImage();
    setInterval(changeImage, 10000);

    fetchWidgetImages().then(images => {
        shuffledImages = shuffle([...images]);
        currentIndex = 0;
        changeImage();
    });
}

startInfiniteSlideshow();
