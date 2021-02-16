const fs = require("fs").promises;
const { Client } = require("@elastic/elasticsearch");

// Define client outside of lambda
const client = new Client({
    node: process.env.ELASTIC_IP,
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
    },
});

// Lambda function associated with /search endpoint
const searchPlayers = async (event) => {
    let name_input;
    try {
        name_input = JSON.parse(event.body).name_input;
    }
    catch(e){
        return {
            statusCode: 200,
            body: JSON.stringify("No name_input found in body"),
        };
    }
    
    const { body } = await client.search({
        index: "baseball",
        body: {
            query: {
                match: {
                    "player.name": { query: name_input, fuzziness: "AUTO" },
                },
            },
        },
    });
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(body.hits.hits),
    };
        return response;
};

module.exports = { searchPlayers };