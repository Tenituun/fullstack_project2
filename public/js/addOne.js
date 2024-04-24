let indexBtn = document.getElementById("index");
indexBtn.addEventListener("click", function(){
    document.location.href = "/index.html";
})

let addForm = document.getElementById("addForm");

//printing the submitted data to the page

function printData(array) {
    clearData();
    let table = document.getElementById('infoTable');
    let text = document.getElementById("textBox");
    text.innerHTML = 'Data was saved like this:';

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

//clearing the table on the page

function clearData(){
    let table = document.getElementById('infoTable');
    table.innerHTML = "";
}

//submitting the form to the server

addForm.addEventListener("submit", function(event){
    event.preventDefault();
    let formData = new FormData(event.target);

    let artist = formData.get("artist");
    let album = formData.get("album");
    let year = formData.get("year");
    let country = formData.get("country");

    let postData = {'artist': artist, 'album': album, 'year': year, 'country': country};

    fetch("/addone.html", {
        method: "POST",
        body: JSON.stringify(postData),
        headers: {
            'Content-Type': "application/json" 
        }
    }).then((response) => {
        console.log(response.status);
        return response.json();
    }).then((result) => {
        console.log("Data saved succesfully with id: "+ result._id);
        printData(result);
    }).catch((error) => {
        console.log(error);
    })
});
