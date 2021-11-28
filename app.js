const express = require("express");
const axios = require("axios");

const { client } = require("./redis.js");

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
    response.status(200).send({
        status: "success",
        message: "Welcome to SpaceX APIs",
    });
});

app.get("/rockets", async (request, response) => {
    try {
        const cachedRockets = await client.get("rockets");

        if (cachedRockets) {
            return response.status(200).send({
                status: "success",
                message: "Successfully fetched the rockets",
                data: {
                    rockets: JSON.parse(cachedRockets),
                },
            });
        }

        const rockets = await axios.get(
            "https://api.spacexdata.com/v3/rockets"
        );

        await client.set("rockets", JSON.stringify(rockets.data), "EX", 60);

        return response.status(200).send({
            status: "success",
            message: "Successfully fetched the rockets",
            data: {
                rockets: rockets.data,
            },
        });
    } catch (error) {
        return response.status(400).send({
            status: "error",
            message: error.message,
        });
    }
});

app.listen(3000, () => {
    console.log("Running on port 3000");
});
