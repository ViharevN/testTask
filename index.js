const express = require('express');
const axios = require("axios");
const pool = require("./connection");

const app = express();

app.get('/user', async (req, res) => {
    try {
        const {data} = await axios.get('https://randomuser.me/api');
        const userData = data.results[0];

        const {
            gender,
            name: {title, first, last},
            location: {
                street: {number, name},
                city,
                state,
                country,
                postcode,
                coordinates: {latitude, longitude},
                timezone: {offset, description},
            },
            email,
            login: {uuid, username, password, salt, md5, sha1, sha256},
            dob: {date, age},
            registered: {date: regDate, age: regAge},
            phone,
            cell,
            id: {name: idName, value: idValue},
            picture: {large, medium, thumbnail},
            nat,
        } = userData;

        const query = `
            INSERT INTO users (gender, title, first_name, last_name, street_number, street_name,
                               city, state, country, postcode, latitude, longitude, timezone_offset,
                               timezone_description, email, uuid, username, password, salt, md5, sha1,
                               sha256, dob, age, reg_date, reg_age, phone, cell, id_name, id_value,
                               picture_large, picture_medium, picture_thumbnail, nat)
            VALUES ('${gender}', '${title}', '${first}', '${last}', ${number}, '${name}',
                    '${city}', '${state}', '${country}', ${postcode}, '${latitude}', '${longitude}',
                    '${offset}', '${description}', '${email}', '${uuid}', '${username}',
                    '${password}', '${salt}', '${md5}', '${sha1}', '${sha256}', '${date}',
                    ${age}, '${regDate}', ${regAge}, '${phone}', '${cell}', '${idName}',
                    '${idValue}', '${large}', '${medium}', '${thumbnail}', '${nat}')
        `;

        await pool.query(query);

        res.send('Data has been saved to the database!');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred fetching and saving data');
    }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`)
});

