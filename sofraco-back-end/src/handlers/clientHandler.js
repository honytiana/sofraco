const Client = require('../models/client');
const fs = require('fs');

class ClientHandler {

    constructor() { }

    createClient(data) {      // signup
        let client = new Client();
        client.numeroContrat = data.numeroContrat;
        client.lastName = data.lastName;
        client.firstName = data.firstName;
        client.cabinet = data.cabinet;
        client.cabinetName = data.cabinetName;
        client.versementCommissions = data.versementCommissions;
        client.save();
        return client;
    }

    getClientById(id) {
        return Client.findById(id);
    }

    getClients() {
        return Client.find({});
    }

    getClientsOfCourtier(courtier) {
        return Client.find({
            courtier: courtier
        });
    }

    getClientById(id) {
        return Client.findOne({ _id: id });
    }

    updateClient(id, data) {
        return Client.findByIdAndUpdate(id, data);
    }

    deleteClient(id) {
        return Client.findByIdAndDelete(id);
    }

    deleteAllClient() {
        return Client.deleteMany({});
    }

    desactivateClient(id) {
        return Client.findByIdAndUpdate(id, { active: 'Inactive', is_enabled: false });
    }

}

module.exports = new ClientHandler();