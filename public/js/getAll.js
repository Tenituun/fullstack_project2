let indexBtn = document.getElementById("index");
indexBtn.addEventListener("click", function(){
    document.location.href = "/index.html";
})

//clearing the table

function clearData(){
    let table = document.getElementById('dataTable');
    table.innerHTML = "";
}

//Printing all the data to a table on the page

function printData(array) {
    clearData();
    let data = array;
    let table = document.getElementById('dataTable');

    table.innerHTML += `<th class="header">ID</th>
                        <th class="header">Artist</th>
                        <th class="header">Album</th>
                        <th class="header">Release Year</th>
                        <th class="header">Country</th>`;

    for (let array of data) {
        

        table.innerHTML += `<tr>
            <td class="rivi">${array._id}</td>
            <td class="rivi">${array.artist}</td>
            <td class="rivi">${array.album_name}</td>
            <td class="rivi">${array.release_year}</td>
            <td class="rivi">${array.country_of_origin}</td>
        </tr>`;
    }
};

let jazz = document.getElementById("jazz");
jazz.addEventListener("click", function(){
    getAllData("jazz");
});

let rock = document.getElementById("rock");
rock.addEventListener("click", function() {
    getAllData("rock");
});

//Function to run when either button is clicked

function getAllData(collection) {
    let postData = collection;
    console.log("You want to " + collection);
    fetch("/getall.html", {
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
        printData(res);
    }).catch((error) => {
        console.log(error);
    })
}

