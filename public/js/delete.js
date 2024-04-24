let indexBtn = document.getElementById("index");
indexBtn.addEventListener("click", function(){
    document.location.href = "/index.html";
})

//fetching all the data from the database

let data = {};
getAllData("user");
let selector = document.getElementById("idSelect");
let updater = document.getElementById("idTable");
function getAllData(collection) {
    let postData = collection;
    console.log("Fetchin all data from " + collection);
    fetch("/delete.html", {
        method: 'POST',
        body: postData,
        headers: {
            'Content-Type': 'text/plain'
        }
    }).then((response) => {
        console.log(response.status);
        console.log("Fetched the data succesfully from: " + postData);
        return response.json();
    }).then((res) => {
        data = res;
        createSelector(res)
    }).catch((error) => {
        console.log(error);
    })
};

//creating a selector for the user to use and show the selected document

function createSelector(array){
    for (let item of array) {
        selector.innerHTML += `<option value=${item._id}>${item._id}</option>`
    };
    document.getElementById("idTable").innerHTML += `<th class="header">ID</th>
                        <th class="header">Artist</th>
                        <th class="header">Album</th>
                        <th class="header">Release Year</th>
                        <th class="header">Country</th>`;        

    document.getElementById("idTable").innerHTML += `<tr>
                        <td class="rivi">${array[0]._id}</td>
                        <td class="rivi">${array[0].artist}</td>
                        <td class="rivi">${array[0].album}</td>
                        <td class="rivi">${array[0].year}</td>
                        <td class="rivi">${array[0].country_of_origin}</td>
                        </tr>`;
};

//using a eventlistener to update the page to reflect the selected item in the selector

selector.addEventListener("change", function(event) {
    let selected = selector.value;
    let obj = data.find(({ _id }) => _id === selected);
    printData(obj)
    function printData(array) {
        clearData();
        function clearData(){
            let table = document.getElementById('idTable');
            table.innerHTML = "";
        }
        let table = document.getElementById('idTable');
    
        table.innerHTML += `<th class="header">ID</th>
                            <th class="header">Artist</th>
                            <th class="header">Album</th>
                            <th class="header">Release Year</th>
                            <th class="header">Country</th>`;        
    
        table.innerHTML += `<tr>
            <td class="rivi">${array._id}</td>
            <td class="rivi">${array.artist}</td>
            <td class="rivi">${array.album}</td>
            <td class="rivi">${array.year}</td>
            <td class="rivi">${array.country_of_origin}</td>
        </tr>`;
    };
});

//making the button to submit the chosen document to the server for deletion

document.getElementById("deleteBtn").addEventListener("click", function(event) {
    event.preventDefault();
    let selected = selector.value;
    let postObj = data.find(({ _id }) => _id === selected);
    let postData = {'_id': postObj._id, 'artist': postObj.artist, 'album': postObj.album, 'year': postObj.year, 'country': postObj.country_of_origin};
    console.log(postData);

    fetch("/delete.html", {
        method: "POST",
        body: JSON.stringify(postData),
        headers: {
            'Content-Type': "application/json"
        }
    }).then((response) => {
        console.log(response.status);
        return response.json();
    }).then((result) => {
        console.log("Item removed, reloading database");
        location.reload();
    }).catch((error) => {
        console.log(error);
    })
});