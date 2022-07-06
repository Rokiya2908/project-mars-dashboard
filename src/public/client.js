// const storePhoto = Immutable.Map({
//     data: '',
//     api: 'photo',
// });


const roversName = Immutable.Map({
    spi: ['Spirit', new Date(2010, 02, 01)],
    opp: ['Opportunity', new Date(2018, 06, 04)],
    curi: ['Curiosity', new Date()]
});

let store = {
    selectedRover: '',
    data: '',
}
// add our markup to the page
const root = document.getElementById('root')
const rover = document.getElementById('rover')
const navLink = document.getElementById('navLink');

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}


const updatePhoto = (store, newState) => {
    store = Object.assign(store, newState)
    renderRover(root, rover, store)
}
const render = async (root, state) => {
    root.innerHTML = App(state)
}

const renderRover = async (root, rover, state) => {
    rover.innerHTML = AppRover(state)
    rover.style.display = ""
    console.log("aaaa" + store.selectedRover)
    console.log(!store.selectedRover == '')
    if (!store.selectedRover == '') {
        root.style.display = "none"
    }

}

const AppRover = (state) => {
    let { selectedRover, data } = state
    return `
    <button onclick="render(root,resetData())" >Con cac</button>
      ${getAllPhotoOfRover(data)}
    `
}

// create content
const App = (state) => {
    let { selectedRover, data } = state
    return `
        <header></header>
        <main>
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(data)}
                
            </section>
        </main>
        <footer></footer>
    `
}


// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
    //renderRover(root, rover, store)
})

// ------------------------------------------------------  COMPONENTS


//create nav link
const CreateLi = () => {
    roversName.valueSeq().forEach(element => {
        let newLi = document.createElement("li")
        let newA = document.createElement("button")
        newLi.setAttribute("id", `${element[0].toLowerCase()}`)
        newA.setAttribute("onclick", `renderRover(root,rover,setState('${element[0].toLowerCase()}'))`)
        newA.innerText = element[0]
        newLi.appendChild(newA)
        navLink.appendChild(newLi)
    });
}

const setState = (selected) => {
    return store.selectedRover = selected;
}
const resetData = () => {
    render(root,store)
    root.style.display = ""
    rover.style.display = "none"
    return store.data = ''
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    //console.log(apod)
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()

    if (!apod || apod.date === today.getDate()) {
        getImageOfTheDay(store)
        let a = document.getElementById("curiosity")
        if (!a) {
            CreateLi()
        }
    }
    else {
        // check if the photo of the day is actually type video!
        if (apod.media_type === "video") {
            return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
        } else {
            return (`
            <img src="${apod.image.url}" class="imgOfDay" />
            <p>${apod.image.explanation}</p>
        `)
        }
    }

}
//function manipulate rover data image
const getAllPhotoOfRover = (data) => {
    //console.log(data)
    if (!data) {
        //init data for rover
        getPhoto(store)
    } else {
        let result = data.mars.photos
        return (`
        <div>
            <p>${result[0].rover.name}</p>
            <p>${result[0].rover.launch_date}</p>
            <p>${result[0].rover.landing_date}</p>
            <p>${result[0].rover.status}</p>
        </div>
        ${getImage(result)}
        `)
    }

}

function getImage(rover) {
    let limitImage = 0
    if (rover.length > 25) {
        limitImage = 25;
    } else {
        limitImage = rover.length
    }
    let result = "";
    console.log(limitImage)
    for (let i = 0; i < limitImage; i++) {
        result += `
        <div>
            <img src='${rover[i].img_src}' height="50%" width="70%">
        </div>
        `
    }
    return result;
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { data } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(data => updateStore(store, { data }))

    return data
}

const getPhoto = (state) => {
    let { selectedRover, data } = state
    let adate
    console.log(selectedRover)
    let findData
    roversName.valueSeq().forEach(element => {
        console.log(element[0].toLowerCase())
        if (element[0].toLowerCase() == selectedRover) {
            findData = element[1];
        }
    })
    console.log("oh hay" + findData)
    if (findData) {
        adate = new Date(findData);
    } else {
        adate = new Date();
    }

    fetch(`mars/${selectedRover}&${adate.getFullYear()}-${adate.getMonth()}-${adate.getDate()}`)
        .then(res => res.json())
        .then(data => updatePhoto(store, { data }))
    return data
}
