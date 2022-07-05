// const storePhoto = Immutable.Map({
//     data: '',
//     api: 'photo',
// });


const roversName = Immutable.Map({
    spi: ['Spirit', new Date(2010, 02, 01)],
    opp: ['Opportunity', new Date(2018, 06, 04)],
    curo: ['Curiosity', new Date()]
});

let store = {
    selectedRover: '',
    data: '',
    date: '',
    //rovers: Immutable.List(['Spirit', 'Opportunity', 'Curiosity']),
}
let intCount = 1;
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
    renderRover(rover, store)
}
const render = async (root, state) => {
    root.innerHTML = App(state)
}

const renderRover = async (root,rover, state) => {
    rover.innerHTML = AppRover(state)
    root.innerHTML = "";
}

const AppRover = (state) => {
    let { selectedRover,data,date } = state
    return `
      ${getAllPhotoOfRover(data)}
    `
}

// create content
const App = (state) => {
    let { selectedRover, data, date } = state
    // console.log(selectedRover)
    // if (selectedRover) {
    //     return `
    //     <p>${getAllPhotoOfRover(data)}</p>
    //     `
    // } else {
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
    // let current = window.location.href
    // if(current.includes("&")){
    //     let roverNameHreft = current.substring(current.indexOf("#"))
    //     store.selectedRover = roverNameHreft.substring(1,roverNameHreft.indexOf("&"))
    //     store.date = roverNameHreft.substring(roverNameHreft.indexOf("&")+1)
    //     console.log(store.selectedRover)
    //     console.log(store.date)
    //     renderRover(rover, store)
    // } 
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}
//create nav link
const CreateLi = () => {
    roversName.valueSeq().forEach(element => {
        let newLi = document.createElement("li")
        let newA = document.createElement("a")
        newLi.setAttribute("id", `${element[0].toLowerCase()}`)
        console.log(element[1])
        let dateSearch = new Date(element[1])
        newA.setAttribute("onclick", `renderRover(rover,{selectedRover= '${element[0].toLowerCase()}',data='',date='${dateSearch.getFullYear()}-${dateSearch.getMonth()}-${dateSearch.getDate()}'} = store)`)
        newA.innerText = element[0]
        newLi.appendChild(newA)
        navLink.appendChild(newLi)
    });
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    //console.log(apod)
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate()) {
        getImageOfTheDay(store)
        CreateLi()
        
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
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
    let { selectedRover, data, date } = state
    let adate = new Date(date);
    console.log(adate)
    fetch(`mars/${selectedRover}&${adate.getFullYear()}-${adate.getMonth()}-${adate.getDate()}`)
        .then(res => res.json())
        .then(data => updatePhoto(store, { data }))
    //console.log(state.url)
    //console.log(data)
    return data
}
