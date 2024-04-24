//Making a connection to MongoDB to fetch data not made with mongoose
export default async function dbConnect(client, dbQuery, collection, id_or_model) {
    try {
        await client.connect();
        let result = await dbQuery(client, collection, id_or_model);
        return result;
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log("Disconnected from the cluster");
    }
};

//Function to return all the data from the desired collection

export async function returnAll(client, collection) {
    if (collection === "" || collection !== "jazz" && collection !== "rock" && collection !== "user"){
        console.log("Collection doesn't exist")
        return
    } else {
        console.log("Collection " + collection + " exists!")
        let db = client.db("albums");
        let coll = db.collection(collection);
        let cursor = await coll.find();
        let results = [];
        await cursor.forEach(element => {
            results.push(element);
        });
        console.log("Success");
        return results;
    }
};

//Function to return only one document with the given id and collection

export async function returnOne(client, collection, userID) {
    if (collection === "" || collection !== "jazz" && collection !== "rock"){
        console.log("Collection doesn't exist")
        return
    } else {
        let db = client.db("albums");
        let coll = db.collection(collection);
        let results = await coll.findOne({ _id: userID });
        console.log(results);
        return results;
    }
};