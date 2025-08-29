const express = require('express');
const app = express();
app.use(express.json());

const fullName = "urza_rai";
const dob = "10102004";
const email = "raiurza@gmail.com";
const roll_number = "22BCT0382";

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.post('/bfhl', (req, res) => {
    try {
        const data = req.body.data;

        if (!Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                message: "'data' field is required and must be an array",
                user_id: `${fullName}_${dob}`,
                email,
                roll_number,
                odd_numbers: [],
                even_numbers: [],
                alphabets: [],
                special_characters: [],
                sum: "0",
                concat_string: ""
            });
        }

        let odd_numbers = [];
        let even_numbers = [];
        let alphabets = [];
        let special_characters = [];
        let sum = 0;
        let concatChars = [];

        data.forEach(item => {
            if (typeof item !== "string") {
                throw new TypeError("All elements in 'data' array must be strings");
            }
            if (/^\d+$/.test(item)) {
                if (parseInt(item) % 2 === 0) {
                    even_numbers.push(item);
                } else {
                    odd_numbers.push(item);
                }
                sum += parseInt(item);
            } else if (/^[a-zA-Z]+$/.test(item)) {
                alphabets.push(item.toUpperCase());
                concatChars.push(item);
            } else {
                special_characters.push(item);
            }
        });

        let concat_string = concatChars.join('');
        concat_string = concat_string
            .split('')
            .reverse()
            .map((char, i) => (i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
            .join('');

        res.status(200).json({
            is_success: true,
            user_id: `${fullName}_${dob}`,
            email,
            roll_number,
            odd_numbers,
            even_numbers,
            alphabets,
            special_characters,
            sum: sum.toString(),
            concat_string
        });
    } catch (err) {
        console.error('Error processing /bfhl request:', err);

        let message = 'Internal server error occurred';

        if (err instanceof SyntaxError || err instanceof TypeError) {
            message = err.message;
        }

        res.status(400).json({
            is_success: false,
            message,
            user_id: `${fullName}_${dob}`,
            email,
            roll_number,
            odd_numbers: [],
            even_numbers: [],
            alphabets: [],
            special_characters: [],
            sum: "0",
            concat_string: ""
        });
    }
});

module.exports = app;
