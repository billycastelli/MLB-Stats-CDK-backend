const fs = require("fs").promises;
const { Client } = require("@elastic/elasticsearch");

// Define client outside of lambda
console.log(process.env.ELASTIC_IP);
console.log(process.env.ELASTIC_USERNAME);
console.log(process.env.ELASTIC_PASSWORD);

const client = new Client({
    node: process.env.ELASTIC_IP,
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
    },
});

// Lambda function associated with /batting/{playerId} endpoint
const getBattingStats = async (event) => {
    const { playerId } = event.pathParameters;
    
    const { body } = await client.search({
        index: "baseball",
        body: {
            query: {
                constant_score: {
                    filter: {
                        term: {
                            "player.playerid": playerId,
                        },
                    },
                },
            },
        },
    });

    let player = {};
    try {
        player = body.hits.hits[0];
    } catch (e) {
        player = { error: "error" };
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(player),
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },        
    };
    return response;
};

module.exports = { getBattingStats };
