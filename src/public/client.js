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
let check = true;
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
    console.log("rover choose " + store.selectedRover)
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
        let currentAttribute = navLink.getAttribute("class")
        if (!currentAttribute.includes("navBar")) {
            navLink.setAttribute("class", `${currentAttribute} navBar`)
        }
        navLink.appendChild(newLi)
    });
}

const setState = (selected) => {
    return store.selectedRover = selected;
}
const resetData = () => {
    render(root, store)
    root.style.display = ""
    rover.style.display = "none"
    return store.data = ''
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()

    if (!apod || apod.date === today.getDate()) {
        getImageOfTheDay(store)
        let a = document.getElementById("curiosity")
        if (!a) {
            CreateLi()
        }
        return (
            `
        <h1 id="loading">Loading...</h1>
        `)
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
    if (!data) {
        //init data for rover
        getPhoto(store, '')
        return (
            `
            <h1 id="loading">Loading...</h1>
            `)
    } else {
        let result = data.mars.photos
        return (`
        <div id = "detail">
            <p>Rover Name     :${result[0].rover.name}</p>
            <p>Launch Date    :${result[0].rover.launch_date}</p>
            <p>Landing Date   :${result[0].rover.landing_date}</p>
            <p>Status         :${result[0].rover.status}</p>
            <p>Photo taken on :${result[0].earth_date}</p>
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
function getDate(selectedRover) {
    let findData
    roversName.valueSeq().forEach(element => {
        if (element[0].toLowerCase() == selectedRover) {
            findData = element[1];
        }
    })

    if (findData) {
        adate = new Date(findData);
    } else {
        adate = new Date();
    }
    return adate;
}
function checker(data) {
    if (!data) {
        return false
    } else {
        return true
    }
}
const getPhoto = (state, date) => {
    let { selectedRover, data } = state
    let adate
    if (date === '') {
        adate = getDate(selectedRover)
    } else {
        adate = new Date(date);
        adate = adate.setDate(adate.getDate() - 1)
    }

    adate = new Date(adate)
    console.log(adate)
    fetch(`mars/${selectedRover}&${adate.getFullYear()}-${adate.getMonth()}-${adate.getDate()}`)
        .then(res => {
            if (res.ok) {

                return res.json()
            }
        })
        .then(data => {
            if (data.mars.photos.length === 0) {
                getPhoto(state, adate)
            } else
                return updatePhoto(store, { data })
        }).catch(
            err => console.error(err)
        )
    return data
}

