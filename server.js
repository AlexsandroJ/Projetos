const app = require("./src/app");
const { baseWebhookURL } = require("./src/config");

const num_spaces = 25;
const precision = 2;
const cardapio = {
    produtos: {
        "Pizzas Normais": [
            { type: "Frango com Catupiry", value: 25.99 },
            { type: "Pepperoni", value: 28.99 },
            { type: "4 Queijos", value: 30.99 },
            { type: "Margherita", value: 30.99 },
            { type: "Calabresa", value: 26.99 },
            { type: "Vegetariana", value: 24.99 },
            { type: "Portuguesa", value: 29.99 },
            { type: "Napolitana", value: 28.99 },
            { type: "Atum", value: 32.99 },
            { type: "Chocolate", value: 22.99 }
        ],
        "Pizzas Meio a Meio": [
            { type: "Margherita e Pepperoni", value: 28.99 },
            { type: "4 Queijos e Frango Catupiry", value: 29.99 },
            { type: "Calabresa e Vegetariana", value: 27.99 },
            { type: "Portuguesa e Napolitana", value: 30.99 },
            { type: "Atum e Chocolate", value: 33.99 },
            { type: "Margherita e 4 Queijos", value: 26.99 },
            { type: "Frango e Calabresa", value: 27.50 },
            { type: "Vegetariana e Portuguesa", value: 28.50 },
            { type: "Napolitana e Atum", value: 31.99 },
            { type: "Pepperoni e Chocolate", value: 27.99 }
        ]
    }
};

let void_space = ' ';
let repeticoes;
let resultado;
let x;
let msg_aux;
let data = "";
let option_pag = 0;
let index = 0;
let saudacao;
let despedida;

const agora = new Date();
const horas = agora.getHours();

if (horas >= 5 && horas < 12) {
    saudacao = "Bom dia ☀️";
    despedida = "Tenha um Ótimo Dia ☀️";
} else if (horas >= 12 && horas < 18) {
    saudacao = "Boa tarde ☀️";
    despedida = "Tenha uma Ótimo Tarde ☀️";
} else {
    saudacao = "Boa noite 🌛​";
    despedida = "Tenha um Ótima Noite 🌛​";
}

const company_name = "CU";
const msg_initial = `🟢​\t${saudacao}\n\nBem vindo ao atendimento ${company_name}\n✏️ Informe o endereço de entrega`;
const get_the_name = `✏️ ​Informe o nome do Cliente`;

const msg_inicial_cardapio = `Seja Bem vindo a pizzaria ${company_name}\n\n\tCardapio:\n`;
msg_aux = msg_inicial_cardapio;
x = 0;
let produtos = cardapio.produtos;
let chaves = Object.keys(produtos);
chaves.forEach((key) => {
    msg_aux += `\n\t${key}\n\n`;
    produtos[key].forEach(element => {
        msg_aux += `${x+1} 👉​${element.type}\n👇\nR$ ${element.value}\n\n`
        x++;
    });
});

const msg_fim_cardapio = `\nDigite uma das opções\n\n#️⃣ Para falar com um de nossos atendentes`
msg_aux += msg_fim_cardapio;
const orders = msg_aux

const edition = `🅾️Editar ✏️`;
const returne = `🅱️Voltar ⬅️`;
const confirmation = `🅰️Confirmar ✅`;

const money_type = "✅\tQual a forma de pagamento \n\n1️⃣Dinheiro\n2️⃣Cartão 💳\n3️⃣Pix";
const option_inval = "❌​\tOpção invalida";
const personal_service = `\t💬 Aguarde um de nossos atendentes\n\n${returne}`;

const pag_money = `✅\tForma de Pagamento:\n\n\tDinheiro\n\n${returne}​\n${confirmation}\n`;
const pag_cart = `✅\tForma de Pagamento:\n\n\tCartão 💳\n\n${returne}​\n${confirmation}\n`;
const pag_pix = `✅\tForma de Pagamento:\n\n\tPix\n\n${returne}​\n${confirmation}\n`;

const pag_type_money = "Dinheiro";
const pag_type_cart = "Cartão 💳";
const pag_type_pix = "Pix";

const dell_orders = `❌\t​Pedidos Vazios\n\nEncerrar Atendimento ?\n\n${returne}​\n${confirmation}\n`;
const end_atendiment = `​👍 Atendimento encerrado\n\n${despedida}`;
const dell_confirmation = `❌\tPedidos Exluido\n${end_atendiment}`;

repeticoes = num_spaces - ('Nome:'.length);
resultado = void_space.repeat(repeticoes);
const text_tab = `\n`;

require("dotenv").config()

const { MongoClient } = require("mongodb");

// Dados de conexão
const username = "admin";
const password = "admin";
const cluster = "localhost:27017";
const dbname = "client_adm";
const collectionName = "clients";
const collectionName_orders = "orders";
const collectionName_personal_service = "personal_service";

const uri = `mongodb://${username}:${password}@${cluster}/?authSource=admin`;
const client_mongo = new MongoClient(uri);
//Banco de pedidos
const database = client_mongo.db(dbname);
const collection = database.collection(collectionName);
//Banco de pedidos confirmados
const database_orders = client_mongo.db(dbname);
const collection_orders = database_orders.collection(collectionName_orders);
//Banco de personal_service
const databse_personal_service = client_mongo.db(dbname);
const collection_personal_service = databse_personal_service.collection(collectionName_personal_service);

async function add_orders(document) {//add new client in data base

    //const collection_orders = database_orders.collection(collectionName_orders);
    try {
        await client_mongo.connect();

        const result = await collection_orders.insertOne(document);
        // Print the ID of the inserted document
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        // Close the MongoDB client connection
        await client_mongo.close();
    }
}
async function add_client(phone) {//add new client in data base
    try {
        await client_mongo.connect();
        const doc = {
            name: " ",
            phone: phone,
            address: " ",
            orders: [],
            etapa: 1,
            money: 0
        }
        const result = await collection.insertOne(doc);
        // Print the ID of the inserted document
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        // Close the MongoDB client connection
        await client_mongo.close();
    }
}
async function update_etapa(phone_filter, num) {//update etapa que controla os estados do cliente
    try {
        await client_mongo.connect();
        const filter = { phone: phone_filter };
        const update = { $set: { etapa: num } };
        const result = await collection.updateOne(filter, update);
        console.log(`${result.matchedCount} documento(s) encontrado(s)`);
        console.log(`${result.modifiedCount} documento(s) modificado(s)`);
    } finally {
        await client_mongo.close();
    }
}
async function update_address(phone_filter, address_new) {//update do endereço do cliente para entrega e checagem do frete
    try {
        await client_mongo.connect();
        const filter = { phone: phone_filter };
        const update = { $set: { address: address_new } };
        const result = await collection.updateOne(filter, update);
        console.log(`${result.matchedCount} documento(s) encontrado(s)`);
        console.log(`${result.modifiedCount} documento(s) modificado(s)`);
    } finally {
        await client_mongo.close();
    }
}
async function update_name(phone_filter, name_new) {//update do nome do cliente para entrega do pedido
    try {
        await client_mongo.connect();
        const filter = { phone: phone_filter };
        const update = { $set: { name: name_new } };
        const result = await collection.updateOne(filter, update);
        console.log(`${result.matchedCount} documento(s) encontrado(s)`);
        console.log(`${result.modifiedCount} documento(s) modificado(s)`);
    } finally {
        await client_mongo.close();
    }
}
async function update_order(phone_filter, type_new, quant_new, value_new) {//update do pedido
    try {
        await client_mongo.connect();
        const filter = { phone: phone_filter };
        const update = {
            $push: {
                orders: {
                    type: type_new,
                    quant: quant_new,
                    value: value_new
                }
            }
        };
        const result = await collection.updateOne(filter, update);
        console.log(`${result.matchedCount} documento(s) encontrado(s)`);
        console.log(`${result.modifiedCount} documento(s) modificado(s)`);
    } finally {
        await client_mongo.close();
    }
}
async function dell_product(phone_filter, type_filter) {//update do pedido
    try {
        await client_mongo.connect();
        const filter = { phone: phone_filter };
        const update = {
            $pull: {
                orders: {
                    type: type_filter

                }
            }
        };
        const result = await collection.updateOne(filter, update);
        console.log(`${result.matchedCount} documento(s) encontrado(s)`);
        console.log(`${result.modifiedCount} documento(s) modificado(s)`);
    } finally {
        await client_mongo.close();
    }
}
async function update_money(phone_filter, money_option) {//update da forma de pagamento
    try {
        await client_mongo.connect();
        const filter = { phone: phone_filter };
        const update = { $set: { money: money_option } };
        const result = await collection.updateOne(filter, update);
        console.log(`${result.matchedCount} documento(s) encontrado(s)`);
        console.log(`${result.modifiedCount} documento(s) modificado(s)`);
    } finally {
        await client_mongo.close();
    }
}
async function update_order_complet(phone_filter) {//update de confirmação de pedido, setado como completo ja pode ir pra produção
    try {
        await client_mongo.connect();
        const filter = { phone: phone_filter };
        const update = { $set: { order_complet: true } };
        const result = await collection.updateOne(filter, update);
        console.log(`${result.matchedCount} documento(s) encontrado(s)`);
        console.log(`${result.modifiedCount} documento(s) modificado(s)`);
    } finally {
        await client_mongo.close();
    }
}
// Start the server
const port = process.env.PORT || 3000
// Check if BASE_WEBHOOK_URL environment variable is available
if (!baseWebhookURL) {
    console.error("BASE_WEBHOOK_URL environment variable is not available. Exiting...")
    process.exit(1) // Terminate the application with an error code
}
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
//const client = new Client();

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'LocalAuth_salves',
        clientId: "client-Alex"
    })
});
client.initialize();
client.on("ready", async () => {
    console.log("READY");
    client.pupPage.on("pageerror", function (err) {
        console.log("Page error: " + err.toString());
    });
    client.pupPage.on("error", function (err) {
        console.log("Page error: " + err.toString());
    });
});
client.on("qr", qr => {
    qrcode.generate(qr, { small: true });
});
client.on("authenticated", () => {
    console.log("AUTHENTICATED");
});
client.on("auth_failure", msg => {
    // Fired if session restore was unsuccessful
    console.error("AUTHENTICATION FAILURE", msg);
});

client.on("message", async msg => {
    await client_mongo.connect();
    const filter = { phone: msg.from };
    const result = await collection.findOne(filter);
    data = "";
    option_pag = 0;
    index = 0;
    msg_aux = '';
    if (result) {
        console.log(`Cliente ${msg.from} em Atendimento`);
        switch (result.etapa) {
            case 1://Opções de endereço
                if (msg.body.length > 3) {
                    let msg_confirmation_address = `✅\tConfirmar Endereço\n\n${msg.body}\n\n${edition}​\n${confirmation}\n`;
                    update_address(msg.from, msg.body).catch(console.dir);
                    client.sendMessage(msg.from, msg_confirmation_address);
                } else if (msg.body === "A") {
                    update_etapa(msg.from, 2).catch(console.dir);
                    client.sendMessage(msg.from, get_the_name);
                } else if (msg.body === "O") {
                    client.sendMessage(msg.from, msg_initial);
                } else {
                    client.sendMessage(msg.from, option_inval);
                }
                break;
            case 2://Opções de nome \n${returne}​\n${confirmation}\n`;
                if (msg.body.length > 3) {
                    let msg_confirmation_name = `✅\tConfirmar Nome\n\n${msg.body}\n\n${edition}​\n${confirmation}\n`;
                    update_name(msg.from, msg.body).catch(console.dir);
                    client.sendMessage(msg.from, msg_confirmation_name);
                } else if (msg.body === "A") {
                    update_etapa(msg.from, 3).catch(console.dir);
                    client.sendMessage(msg.from, orders);
                } else if (msg.body === "O") {
                    client.sendMessage(msg.from, get_the_name);
                } else {
                    client.sendMessage(msg.from, option_inval);
                }
                break;
            case 3://Opções de pedidos
                //Criação do menu de pedidos
                index = parseInt(msg.body) - 1;
                if (index >= 0 && index <= 20) {
                    x = 0
                    chaves.forEach((key) => {
                        produtos[key].forEach(element => {
                            if (index == x) {
                                msg_aux = `✅\tAdicionado:\n\n${element.type}\n\n${edition}\n${returne}\n${confirmation}\n`;
                                client.sendMessage(msg.from, msg_aux);
                                update_order(msg.from, element.type, 1, element.value).catch(console.dir);
                            }
                            x++;
                        });
                    });
                } else if (msg.body === "#") {
                    await collection_personal_service.insertOne({ phone: msg.from });
                    await collection.deleteOne(filter);
                    client.sendMessage(msg.from, personal_service);
                    update_etapa(msg.from, 7).catch(console.dir);
                } else if (msg.body === "B") {
                    client.sendMessage(msg.from, orders);
                } else if (msg.body === "A") {
                    client.sendMessage(msg.from, money_type);
                    update_etapa(msg.from, 5).catch(console.dir);
                } else if (msg.body === "O") {
                    data = text_tab;
                    index = 0;
                    total = 0;
                    result.orders.forEach(element => {
                        total += element.value;
                        data += `${index} 👉​${element.type}\n👇\nR$ ${element.value}\n\n`;
                        index++;
                    });
                    msg_aux = `✅\tPedidos Confirmados\n${data}\nTotal: R$ ${total.toFixed(precision)}\nSelecione a opção que deseja excluir do pedido\n\n${confirmation}\n`;
                    client.sendMessage(msg.from, msg_aux);
                    update_etapa(msg.from, 4).catch(console.dir);
                } else {
                    client.sendMessage(msg.from, option_inval);
                }
                break;
            case 4://Opções de edição de produtos
                if (msg.body === "A" && result.orders.length > 0) {
                    update_etapa(msg.from, 5).catch(console.dir);
                    client.sendMessage(msg.from, money_type);
                } else {
                    // Filtro para encontrar o documento
                    index = parseInt(msg.body);
                    if (result.orders.length > 0) {
                        const orders = result.orders;
                        // Índice do elemento a ser removido
                        const indexToRemove = index;
                        // Remover o elemento do array
                        if (indexToRemove > -1 && indexToRemove < orders.length) {
                            orders.splice(indexToRemove, 1);
                        } else {
                            client.sendMessage(msg.from, option_inval);
                        }
                        // Atualizar o documento com o novo array
                        const update = { $set: { orders: orders } };
                        await collection.updateOne(filter, update);
                        data = text_tab;
                        index = 0;
                        total = 0;
                        result.orders.forEach(element => {
                            total += element.value;
                            data += `${index} 👉​${element.type}\n👇\nR$ ${element.value}\n\n`;
                            index++;
                        });
                        msg_aux = `✅\tPedidos Confirmados\n${data}\nTotal:\tR$ ${total.toFixed(precision)}\nSelecione a opção que deseja excluir do pedido\n\n${confirmation}\n`;
                        if (result.orders.length > 0) {
                            client.sendMessage(msg.from, msg_aux);
                        } else {
                            client.sendMessage(msg.from, dell_orders);
                        }
                        console.log("Elemento removido do array e documento atualizado.");
                    } else if (result.orders.length == 0) {
                        //client.sendMessage(msg.from, dell_orders);
                        console.log("Nenhum documento encontrado com o filtro especificado.");
                        if (msg.body === "A") {
                            //escluir dados
                            await collection.deleteOne(filter);
                            client.sendMessage(msg.from, dell_confirmation);
                        } else if (msg.body === "B") {
                            //voltar para cardapio
                            update_etapa(msg.from, 3).catch(console.dir);
                            client.sendMessage(msg.from, orders);
                        } else {
                            client.sendMessage(msg.from, option_inval);
                        }
                    }
                }
                break;
            case 5://Opções de pagamento
                //criação de string do menu de dados
                data = text_tab;
                total = 0
                result.orders.forEach(element => {
                    total += element.value;
                    data += `${element.type}\nR$ ${element.value}\n`;
                });
                if (result.money == 1) {
                    option_pag = pag_type_money;
                } else if (result.money == 2) {
                    option_pag = pag_type_cart;
                } else if (result.money == 3) {
                    option_pag = pag_type_pix;
                }
                if(msg.body === "4"){
                    client.sendMessage(msg.from, menuFormatado);
                }
                let msg_confirmation_order = `✅\tPedidos Confirmados\n${data}\nTotal:\tR$ ${total.toFixed(precision)}\n✅Pagamento:\n${option_pag}\n✅Endereço:\n${result.address}\n✅Cliente:\n${result.name}\n\n${returne}\n​​${confirmation}\n `;
                if (msg.body === "1") {// dinheiro
                    update_money(msg.from, 1).catch(console.dir);;
                    client.sendMessage(msg.from, pag_money);
                } else if (msg.body === "2") {// cartão
                    update_money(msg.from, 2).catch(console.dir);;
                    client.sendMessage(msg.from, pag_cart);
                } else if (msg.body === "3") {// pix
                    update_money(msg.from, 3).catch(console.dir);;
                    client.sendMessage(msg.from, pag_pix);
                } else if (msg.body === "B") {
                    update_etapa(msg.from, 3).catch(console.dir);
                    client.sendMessage(msg.from, orders);
                } else if (msg.body === "A") {
                    update_etapa(msg.from, 6).catch(console.dir);
                    client.sendMessage(msg.from, msg_confirmation_order);
                } else {
                    client.sendMessage(msg.from, option_inval);
                }
                break;
            case 6://Opções de confirmação de pedido
                data = text_tab;
                total = 0
                result.orders.forEach(element => {
                    total += element.value;
                    data += `${element.type}\nR$ ${element.value}\n`;
                });
                if (result.money == 1) {
                    option_pag = pag_type_money;
                } else if (result.money == 2) {
                    option_pag = pag_type_cart;
                } else if (result.money == 3) {
                    option_pag = pag_type_pix;
                }
                if (msg.body === "A") {
                    let msg_confirmation_order = `✅\tPedidos Em fila de preparação\n${data}\nTotal:\tR$ ${total.toFixed(precision)}\n✅Pagamento:\n${option_pag}\n✅Endereço:\n${result.address}\n✅Cliente:\n${result.name}\n\nFinalizado✅\nAvisaremos quando o pedido sair pra entrega 🛵\n\n\t\t${end_atendiment}​`;
                    client.sendMessage(msg.from, msg_confirmation_order);
                    await collection_orders.insertOne(result);
                    await collection.deleteOne(filter);
                } else if (msg.body === "B") {
                    update_etapa(msg.from, 3).catch(console.dir);
                    client.sendMessage(msg.from, orders);
                } else {
                    client.sendMessage(msg.from, option_inval);
                }
                break;
            case 7:
                if (msg.body === "A") {
                    update_etapa(msg.from, 1).catch(console.dir);
                    await collection.deleteOne(filter);
                    client.sendMessage(msg.from, orders);
                } else {
                    client.sendMessage(msg.from, personal_service);
                }
                break;
            default:
                // Este ponto nunca deve ser alcançado devido à verificação inicial
                throw new Error("Opção inválida, etapa fora do escorpo do projeto");
        }
    } else {
        console.log(`Novo Cliente ${msg.from} Cadastrado`);
        client.sendMessage(msg.from, msg_initial);
        add_client(msg.from)
    }
});