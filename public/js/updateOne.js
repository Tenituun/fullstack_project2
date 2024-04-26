let indexBtn = document.getElementById("index");
indexBtn.addEventListener("click", function(){
    document.location.href = "/index.html";
})

//getting all the data from the server

let data = {};
getAllData("user");
let selector = document.getElementById("idSelect");
let updater = document.getElementById("updateForm");
function getAllData(collection) {
    let postData = collection;
    console.log("Fetching all data from " + collection);
    fetch("/update.html", {
        method: 'POST',
        body: postData,
        headers: {
            'Content-Type': 'text/plain'
        }
    }).then((response) => {
        console.log(response.status);
        console.log("Data fetched from: " + postData);
        return response.json();
    }).then((res) => {
        data = res;
        createSelector(res)
    }).catch((error) => {
        console.log(error);
    })
};

//creating a selector from the databse data

function createSelector(array){
    for (let item of array) {
        selector.innerHTML += `<option value=${item._id}>${item._id}</option>`
    };
    updater.innerHTML =    `<label for="giveArtist">Update artist name</label>
                            <input type="text" value=${array[0].artist} id="giveArtist" name="artist" >
                            </br>
                            <label for="giveAlbum">Update album name</label>
                            <input type="text" value=${array[0].album} id="giveAlbum" name="album" >
                            </br>
                            <label for="giveYear">Update release year</label>
                            <input type="number" value=${array[0].year} id="giveYear" name="year" >
                            </br>
                            <label for="giveCountry">Update country of origin</label>
                            <input type="text" value=${array[0].country_of_origin} id="giveCountry" name="country" >
                            </br>
                            <button id=updateBtn value="Update" type="submit">Update</button>`
};

//adding an event listener to follow the user and showing the correct data on the form

selector.addEventListener("change", function(event) {
    let selected = selector.value;
    let obj = data.find(({ _id }) => _id === selected);
    updater.innerHTML =    `<label for="giveArtist">Update artist name</label>
                            <input type="text" value=${obj.artist} id="giveArtist" name="artist" >
                            </br>
                            <label for="giveAlbum">Update album name</label>
                            <input type="text" value=${obj.album} id="giveAlbum" name="album" >
                            </br>
                            <label for="giveYear">Update release year</label>
                            <input type="number" value=${obj.year} id="giveYear" name="year" >
                            </br>
                            <label for="giveCountry">Update country of origin</label>
                            <input type="text" value=${obj.country_of_origin} id="giveCountry" name="country" >
                            </br>
                            <button id=updateBtn value="Update" type="submit">Update</button>`;
});

//submitting the data from the form to the server

document.getElementById("updateForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let id = selector.value;
    let artist = formData.get("artist");
    let album = formData.get("album");
    let year = formData.get("year");
    let country = formData.get("country");
    let postData = {'_id': id, 'artist': artist, 'album': album, 'year': year, 'country': country};

    fetch("/update.html", {
        method: "POST",
        body: JSON.stringify(postData),
        headers: {
            'Content-Type': "application/json"
        }
    }).then((response) => {
        console.log(response.status);
        return response.json();
    }).then((result) => {
        console.log("Item with the id: " + result._id + " updated succesfully");
        location.reload();
    }).catch((error) => {
        console.log(error);
    })
});