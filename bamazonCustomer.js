var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table")

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;

    start();
});



function start() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        promptCust(res);


    })

}

function promptCust(res) {

    inquirer
        .prompt([{
            name: "item",
            type: "input",
            message: "What is the ID of the product you would like to purchase?"
        }]).then(async function(input) {
            var stuff = parseInt(input.item)
            console.log(stuff, "46");
            var product = await inventoryCheck(res, stuff);
            console.log(product)
            promptQuant(product);

        })

};

function inventoryCheck(res, input) {
    for (let i = 0; i < res.length; i++) {
        if (res[i].item_id == input) {
            return res[i];
            // console.log(res[i], "59");

        }

    }
    return null;
}


function promptQuant(res) {

    inquirer
        .prompt([{
            name: "quantity",
            type: "input",
            message: "How many would you like?"

        }]).then(function(input) {
            var otherStuff = parseInt(input.quantity)
            console.log(res);
            if (otherStuff <= res.stock_quantity) {
                makePurchase(res, otherStuff);
            } else {
                console.log("We out!")
            }

        })
}

function makePurchase(res1, input) {
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [input, res1.item_id], function(err, res) {
        if (err) throw err;
        console.log("Successfully purchased $" + input * res1.price)

    })

}