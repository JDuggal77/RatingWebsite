/***************************************************************************
FILE: questions.js

This is a RESTful endpoint for logging question responses.

It supports GET, POST, and DELETE.

The POST should be a JSON object containing fields:
USER_ID : String // should be the corresponding Mongo native _id from pre-survey
initial_statement: String
initial_rating: 4
initial_reasoning: String
response_a : Object
    {
        llm_response: String
        persuasion_rating: int
    }
response_b : Object
    {
        llm_response: String
        persuasion_rating: int
    }
response_selection: String

The GET output is an array of JSON objects containing the aforementioned
fields.
***************************************************************************/
const { MongoClient, ObjectId } = require("mongodb");

const uri =  process.env.MONGODB_URI;
const client = new MongoClient(uri);
const collection = () => client.db("rating-interface").collection("questions")

let isConnected = false;

const connectClient = async () => {
    if (!isConnected) {
        await client.connect();
        isConnected = true;
    }
};

const sendJson = (statusCode, body) => ({
    statusCode,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
});

exports.handler = async (event) => {
    const method = event.httpMethod;
    try {
        await connectClient();

        if(method === "GET") {
            const items = await collection().find({}).toArray();
            return sendJson(200, items);
        }
        
        if(method === "POST"){
            const body = event.body ? JSON.parse(event.body) : {};
            const result = await collection().insertOne(body)
            return sendJson(201, result);
        }

        if(method === "DELETE"){
            const id = event.queryStringParameters?.id;
            if(!id) return sendJson(400, {error: "Missing ID query parametery"});
            await collection().deleteOne({_id : new ObjectId(id)});
            return sendJson(200, {success : true});
        }

        return sendJson(405, {error: `Method ${Method} not allowed.`})
    }

    catch (error){
        console.error(error);
        return sendJson(500, {error: `Failed to ${method} question-set-1`});
    }
}
