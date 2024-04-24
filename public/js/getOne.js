let indexBtn = document.getElementById("index");
indexBtn.addEventListener("click", function(){
    document.location.href = "/index.html";
})

//cancelling the default submit

let idForm = document.getElementById("idForm");
idForm.addEventListener("submit", function(event){
    event.preventDefault();
});

//clearing the data on the table

function clearData(){
    let table = document.getElementById('idTable');
    table.innerHTML = "";
}

//printing the requested data to a table

function printData(array) {
    clearData();
    let table = document.getElementById('idTable');

    table.innerHTML += `<th class="header">ID</th>
                        <th class="header">Artist</th>
                        <th class="header">Album</th>
                        <th class="header">Release Year</th>
                        <th class="header">Country</th>`;        

    table.innerHTML += `<tr>
        <td class="rivi">${array._id}</td>
        <td class="rivi">${array.artist}</td>
        <td class="rivi">${array.album_name}</td>
        <td class="rivi">${array.release_year}</td>
        <td class="rivi">${array.country_of_origin}</td>
    </tr>`;
};

let infoBox = document.getElementById("infoBox");
let jazz = document.getElementById("jazz");
jazz.addEventListener("click", function(){
    let formID = document.getElementById("giveID").value;
    getData("jazz", formID);
});

let rock = document.getElementById("rock");
rock.addEventListener("click", function() {
    let formID = document.getElementById("giveID").value;
    getData("rock", formID);
});

//fetching the requested document with a given ID and collection depending on the button pressed

function getData(collection, id){
    if (id == "" || id >= 41){
        infoBox.innerHTML = "Write a number between 1-40";
        console.log("You can't " + collection + " with ID being over 40!!!")
    } else {
        infoBox.innerHTML = "";
        console.log("You " + collection + "ed with an ID of: " + id);
        let postData = {'collection': collection, 'id': id};
        fetch("/getone.html", {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log(response.status);
            return response.json();
        }).then((res) => {
            console.log("Data fetched from " + collection + " with the id: " + id);
            printData(res);
        }).catch((error) => {
            console.log(error);
        })
    }
}
