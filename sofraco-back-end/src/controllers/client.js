const path = require('path');

const Client = require('../models/client');
const clientHandler = require('../handlers/clientHandler');
const clientService = require('../services/features/client');


exports.createClients = async (req, res) => {
    try {
        console.log(`${new Date()} create clients`);
        let rattachements;
        if (req.params.name !== 'undefined') {
            const file = path.join(__dirname, '..', '..', '..', 'documents', `${req.params.name}.xlsx`);
            rattachements = await clientService.readExcelRattachementClient(file);
        } else {
            rattachements = await clientService.readExcelRattachementClient(req.file.path);
        }
        for (let rattachement of rattachements) {
            const c = await clientHandler.createClient(rattachement);
        }
        res.status(200).end(`${new Date()} Clients added`);
    } catch (error) {
        res.status(400).json({ error })
    }

};

exports.createClient = async (req, res) => {
    try {
        console.log(`${new Date()} create client`);
        const client = await clientHandler.createClient(req.body);
        console.log(`${new Date()} Client added`);
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error })
    }

};

exports.getClient = async (req, res) => {
    console.log(`${new Date()} get client`);
    try {
        const client = await clientHandler.getClientById(req.params.id);
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getClients = async (req, res) => {
    console.log(`${new Date()} get clients`);
    try {
        const clients = await clientHandler.getClients();
        res.status(200).json(clients);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getClientsOfCourtier = async (req, res) => {
    console.log(`${new Date()} get clients of courtier`);
    try {
        const clients = await clientHandler.getClientsOfCourtier(req.params.courtier);
        res.status(200).json(clients);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.updateClient = async (req, res) => {
    console.log(`${new Date()} Update client`);
    try {
        const client = await clientHandler.updateClient(req.params.id, req.body);
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.deleteClient = async (req, res) => {
    console.log(`${new Date()} Delete client`);
    try {
        const clients = await clientHandler.deleteClient(req.params.id);
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.deleteAllClients = async (req, res) => {
    console.log(`${new Date()} Delete all clients`);
    try {
        const clients = await clientHandler.deleteAllClient();
        res.status(200).end(`Clients deleted`);
    } catch (error) {
        res.status(500).json({ error });
    }
};
