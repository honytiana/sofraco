module.exports = {
    openapi: "3.0.3", // present supported openapi version
    info: {
        title: "Sofraco bordereaux API",
        description: "Pour la gestion des bordereaux de Sofraco API",
        version: "1.0.0",
        contact: {
            name: "Sofraco",
            email: "",
            url: "",
        },
    },
    servers: [
        {
            url: "http://localhost:9000/api",
            description: "Sofraco back end",
        },
    ],
    tags: [
        {
            name: "client", // name of a tag,
            description: "Clients Sofraco",
            externalDocs: {
                url: "http://docs.my-api.com/pet-operations.htm"
            }
        },
        {
            name: "company", // name of a tag,
            description: "Compagnies Sofraco",
            externalDocs: {
                url: "http://docs.my-api.com/pet-operations.htm"
            }
        },
        {
            name: "correspondance", // name of a tag,
            description: "Correspondance Sofraco",
            externalDocs: {
                url: "http://docs.my-api.com/pet-operations.htm"
            }
        },
        {
            name: "courtier", // name of a tag,
            description: "Courtier Sofraco",
            externalDocs: {
                url: "http://docs.my-api.com/pet-operations.htm"
            }
        },
        {
            name: "document", // name of a tag,
            description: "Document Sofraco",
            externalDocs: {
                url: "http://docs.my-api.com/pet-operations.htm"
            }
        },
        {
            name: "excelMaster", // name of a tag,
            description: "Excel Master Sofraco",
            externalDocs: {
                url: "http://docs.my-api.com/pet-operations.htm"
            }
        },
        {
            name: "mailer", // name of a tag,
            description: "Mailer Sofraco",
            externalDocs: {
                url: "http://docs.my-api.com/pet-operations.htm"
            }
        },
        {
            name: "swagger", // name of a tag,
            description: "Swagger Sofracos",
            externalDocs: {
                url: "http://docs.my-api.com/pet-operations.htm"
            }
        },
        {
            name: "token", // name of a tag,
            description: "Token Sofraco",
            externalDocs: {
                url: "http://docs.my-api.com/pet-operations.htm"
            }
        },
        {
            name: "treatment", // name of a tag,
            description: "Treatment Sofraco",
            externalDocs: {
                url: "http://docs.my-api.com/pet-operations.htm"
            }
        },
        {
            name: "user", // name of a tag,
            description: "User Sofraco",
            externalDocs: {
                url: "http://docs.my-api.com/pet-operations.htm"
            }
        },
    ],
    paths: {
        "/client": {
            get: {
                tags: ['client'],
                summary: "Retourne les clients",
                description: "",
                operationId: "getClients",
                produces: [
                    "application/json"
                ],
                parameters: [
                ],
                responses: {
                    200: {
                        description: "Clients retournés avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    },
                    404: {
                        description: "Clients non trouvés"
                    }
                },
                security: [
                    {
                        api_key: []
                    }
                ]
            },
            post: {
                tags: ['client'],
                summary: "Ajout d'un nouveau client",
                description: "",
                operationId: "createClient",
                consumes: [
                    "application/json"
                ],
                produces: [
                    "application/json"
                ],
                parameters: [
                    {
                        in: "body",
                        name: "body",
                        description: "Objet client à ajouter",
                        required: true,
                        schema: {
                            "$ref": "#/definitions/Client"
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Client ajouté avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    }
                }
            },
            delete: {
                tags: ['client'],
                summary: "Supprime tous les clients",
                description: "",
                operationId: "deleteAllClients",
                produces: [
                    "application/json"
                ],
                parameters: [
                ],
                responses: {
                    200: {
                        description: "Clients supprimés avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    },
                    404: {
                        description: "Clients non trouvés"
                    }
                }
            },
        },
        "/client/{_id}": {
            get: {
                tags: ['client'],
                summary: "Retourne le client a partir de l'id",
                description: "",
                operationId: "getClient",
                produces: [
                    "application/json"
                ],
                parameters: [
                    {
                        name: "_id",
                        in: "path",
                        description: "L'id du client à rechercher",
                        required: true,
                        type: "string"
                    }
                ],
                responses: {
                    200: {
                        description: "Client retourné avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    },
                    404: {
                        description: "Client non trouvé"
                    }
                }
            },
            put: {
                tags: ['client'],
                summary: "Modification du client défini par l'id",
                description: "",
                operationId: "updateClient",
                consumes: [
                    "application/json"
                ],
                produces: [
                    "application/json"
                ],
                parameters: [
                    {
                        name: "_id",
                        in: "path",
                        description: "L'id du client à modifier",
                        required: true,
                        type: "string"
                    },
                    {
                        in: "body",
                        name: "body",
                        description: "Objet client mis à jour pour la modification",
                        required: true,
                        schema: {
                            "$ref": "#/definitions/Client"
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Client modifié avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    },
                    500: {
                        description: "Internal server error"
                    }
                }
            },
            delete: {
                tags: ['client'],
                summary: "Supprime le client avec l'id défini",
                description: "",
                operationId: "deleteClient",
                produces: [
                    "application/json"
                ],
                parameters: [
                ],
                responses: {
                    200: {
                        description: "Client supprimé avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    },
                    404: {
                        description: "Client non trouvé"
                    }
                }
            },
        },
        "/client/courtier/{courtier}": {
            get: {
                tags: ['client'],
                summary: "Retourne les clients d'un courtier",
                description: "",
                operationId: "getClientsOfCourtier",
                produces: [
                    "application/json"
                ],
                parameters: [
                    {
                        name: "courtier",
                        in: "path",
                        description: "L'id du courtier",
                        required: true,
                        type: "string"
                    }
                ],
                responses: {
                    200: {
                        description: "Clients retournés avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    },
                    404: {
                        description: "Clients non trouvés"
                    }
                }
            },
        },
        "/company": {
            get: {
                tags: ['company'],
                summary: "Retourne les compagnies",
                description: "",
                operationId: "getCompanies",
                produces: [
                    "application/json"
                ],
                parameters: [
                ],
                responses: {
                    200: {
                        description: "Compagnies retournés avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    },
                    404: {
                        description: "Compagnies non trouvés"
                    }
                },
                security: [
                    {
                        api_key: []
                    }
                ]
            },
            post: {
                tags: ['company'],
                summary: "Ajout d'une nouvelle compagnie",
                description: "",
                operationId: "createCompany",
                consumes: [
                    "application/json"
                ],
                produces: [
                    "application/json"
                ],
                parameters: [
                    {
                        in: "body",
                        name: "body",
                        description: "Objet compagnie à ajouter",
                        required: true,
                        schema: {
                            "$ref": "#/definitions/Company"
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Compagnie ajouté avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    }
                }
            }
        },
        "/company/{_id}": {
            get: {
                tags: ['company'],
                summary: "Retourne la compagnie a partir de l'id",
                description: "",
                operationId: "getCompany",
                produces: [
                    "application/json"
                ],
                parameters: [
                    {
                        name: "_id",
                        in: "path",
                        description: "L'id de la compagnie à rechercher",
                        required: true,
                        type: "string"
                    }
                ],
                responses: {
                    200: {
                        description: "Compagnie retourné avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    },
                    404: {
                        description: "Compagnie non trouvé"
                    }
                }
            },
            put: {
                tags: ['company'],
                summary: "Modification de la compagnie définie par l'id",
                description: "",
                operationId: "updateCompany",
                consumes: [
                    "application/json"
                ],
                produces: [
                    "application/json"
                ],
                parameters: [
                    {
                        name: "_id",
                        in: "path",
                        description: "L'id du client à modifier",
                        required: true,
                        type: "string"
                    },
                    {
                        in: "body",
                        name: "body",
                        description: "Objet client mis à jour pour la modification",
                        required: true,
                        schema: {
                            "$ref": "#/definitions/Company"
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Client modifié avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    },
                    500: {
                        description: "Internal server error"
                    }
                }
            },
            delete: {
                tags: ['company'],
                summary: "Supprime la compagnie avec l'id défini",
                description: "",
                operationId: "deleteCompany",
                produces: [
                    "application/json"
                ],
                parameters: [
                ],
                responses: {
                    200: {
                        description: "Compagnie supprimé avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    },
                    404: {
                        description: "Compagnie non trouvé"
                    }
                }
            },
        },
        "/company/name/{name}": {
            get: {
                tags: ['company'],
                summary: "Retourne la compagnie correspondant au name",
                description: "",
                operationId: "getCompanyByName",
                produces: [
                    "application/json"
                ],
                parameters: [
                    {
                        name: "name",
                        in: "path",
                        description: "Le name de la compagnie",
                        required: true,
                        type: "string"
                    }
                ],
                responses: {
                    200: {
                        description: "Compagnie retournée avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    },
                    404: {
                        description: "Compagnie non trouvé"
                    }
                }
            },
        },
        "/company/search/{name}": {
            get: {
                tags: ['company'],
                summary: "Retourne les compagnies qui match le name",
                description: "",
                operationId: "getCompaniesLike",
                produces: [
                    "application/json"
                ],
                parameters: [
                    {
                        name: "name",
                        in: "path",
                        description: "Le name de la compagnie",
                        required: true,
                        type: "string"
                    }
                ],
                responses: {
                    200: {
                        description: "Compagnies retournées avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    },
                    404: {
                        description: "Compagnies non trouvés"
                    }
                }
            },
        },
        "/companySurco/{companySurco}": {
            get: {
                tags: ['company'],
                summary: "Retourne la compagnie qui contient la compagnie Surco",
                description: "",
                operationId: "getCompanyByCompanySurco",
                produces: [
                    "application/json"
                ],
                parameters: [
                    {
                        name: "companySurco",
                        in: "path",
                        description: "Le nom de la compagnie surco",
                        required: true,
                        type: "string"
                    }
                ],
                responses: {
                    200: {
                        description: "Compagnie retournée avec succès"
                    },
                    401: {
                        description: "Unauthorized"
                    },
                    404: {
                        description: "Compagnie non trouvé"
                    }
                }
            },
        },
    },
    definitions: {
        Client: {
            type: "object",
            properties: {
                _id: {
                    type: "string"
                },
                lastName: {
                    type: "string"
                },
                firstName: {
                    type: "string"
                },
                courtier: {
                    type: "string"
                },
                email: {
                    type: "string"
                },
                phone: {
                    type: "string"
                },
            }
        },
        Company: {
            type: "object",
            properties: {
                _id: {
                    type: "string"
                },
                globalName: {
                    type: "string"
                },
                name: {
                    type: "string"
                },
                logo: {
                    type: "string"
                },
                address: {
                    type: "string"
                },
                zip: {
                    type: "string"
                },
                city: {
                    type: "string"
                },
                country: {
                    type: "string"
                },
                creation_date: {
                    type: "string"
                },
                phone: {
                    type: "string"
                },
                website: {
                    type: "string"
                },
                is_enabled: {
                    type: "string"
                },
                surco: {
                    type: "string"
                },
                companySurco: {
                    type: "string"
                },
                type: {
                    type: "string"
                },
            }
        },
        Correspondance: {
            type: "object",
            properties: {
                _id: {
                    type: "string"
                },
                courtier: {
                    type: "string"
                },
                role_courtier: {
                    type: "string"
                },
                companies: {
                    type: "string"
                },
                is_enabled: {
                    type: "string"
                }
            }
        },
        Courtier: {
            type: "object",
            properties: {
                _id: {
                    type: "string"
                },
                lastName: {
                    type: "string"
                },
                firstName: {
                    type: "string"
                },
                cabinet: {
                    type: "string"
                },
                email: {
                    type: "string"
                },
                emailCopie: {
                    type: "string"
                },
                phone: {
                    type: "string"
                },
                status: {
                    type: "string"
                },
                role: {
                    type: "string"
                },
                is_enabled: {
                    type: "string"
                },
            }
        },
        Document: {
            type: "object",
            properties: {
                _id: {
                    type: "string"
                },
                name: {
                    type: "string"
                },
                user: {
                    type: "string"
                },
                company: {
                    type: "string"
                },
                companyGlobalName: {
                    type: "string"
                },
                companyName: {
                    type: "string"
                },
                upload_date: {
                    type: "string"
                },
                treatment_date: {
                    type: "string"
                },
                path_original_file: {
                    type: "string"
                },
                type: {
                    type: "string"
                },
                is_enabled: {
                    type: "string"
                },
                status: {
                    type: "string"
                },
                ocr: {
                    type: "string"
                },
            }
        },
        ExcelMaster: {
            type: "object",
            properties: {
                _id: {
                    type: "string"
                },
                courtier: {
                    type: "string"
                },
                cabinet: {
                    type: "string"
                },
                create_date: {
                    type: "string"
                },
                path: {
                    type: "string"
                },
                type: {
                    type: "string"
                },
                content: {
                    type: "string"
                },
                is_enabled: {
                    type: "string"
                }
            }
        },
        Token: {
            type: "object",
            properties: {
                _id: {
                    type: "string"
                },
                value: {
                    type: "string"
                },
                userId: {
                    type: "string"
                },
                issuedAt: {
                    type: "string"
                },
                expiresIn: {
                    type: "string"
                }
            }
        },
        Treatment: {
            type: "object",
            properties: {
                _id: {
                    type: "string"
                },
                user: {
                    type: "string"
                },
                begin_treatment: {
                    type: "string"
                },
                end_treatment: {
                    type: "string"
                },
                status: {
                    type: "string"
                },
                progress: {
                    type: "string"
                }
            }
        },
        User: {
            type: "object",
            properties: {
                _id: {
                    type: "string"
                },
                firstName: {
                    type: "string"
                },
                lastName: {
                    type: "string"
                },
                email: {
                    type: "string"
                },
                login: {
                    type: "string"
                },
                password: {
                    type: "string"
                },
                role: {
                    type: "string"
                },
                create_date: {
                    type: "string"
                },
                is_enabled: {
                    type: "string"
                }
            }
        },
    }

}