export const swaggerJson = {
    "openapi": "3.0.0",
    "info": {
        "title": "Seller's Information.",
        "description": "Return seller's data.",
        "contact": {
            "email": "aline.cristina.2k17@outlook.com"
        },
        "version": "1.0.0?"
    },
    "servers": [
        {
            "url": "http://localhost:3000/v1/sellers",
            "description": "API test."
        }
    ],
    "paths": {
        "/": {
            "post": {
                "summary": "Create seller",
                "description": "Router responsible for seller's creation.",
                "tags": ["Sellers"],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Seller"
                            },
                            "examples": {
                                "schema": {
                                    "value": {
                                        "seller_id": 1,
                                        "name": "McDonalds",
                                        "cnpj": "90891366000190",
                                        "bankCode": 33,
                                        "bankAccount": 1000,
                                        "notes": ""
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Created"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            },
            "get": {
                "summary": "Return all sellers by page.",
                "description": "Router responsible for finding sellers with filters.",
                "tags": ["Sellers"],
                "parameters":[
                    {
                        "name": "seller_id",
                        "in": "query",
                        "description": "seller_id"
                    },
                    {
                        "name": "name",
                        "in": "query",
                        "description": "name"
                    },
                    {
                        "name": "cnpj",
                        "in": "query",
                        "description": "CNPJ"
                    },
                    {
                        "name": "bankCode",
                        "in": "query",
                        "description": "Bank code"
                    },
                    {
                        "name": "bankAccount",
                        "in": "query",
                        "description": "bank account"
                    },
                    {
                        "name": "page",
                        "in": "query",
                        "description": "Current page",
                        "required": true
                    },
                    {
                        "name": "pageSize",
                        "in": "query",
                        "description": "Items by page",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Seller"
                                    }
                                }
                            }
                        }
                    }
                }

            }
        },
        "/{id}": {
            "get": {
                "description": "Find seller by seller_id",
                "summary": "Find seller by seller_id",
                "tags": ["Sellers"],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "description": "seller_id",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "$ref": "#/components/schemas/Seller"
                                }
                            }
                        }
                    }
                }
            },
            "patch": {
                "description": "Update seller's data by seller_id",
                "summary": "Update",
                "tags": ["Sellers"],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "description": "seller_id",
                        "required": true
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json":{
                            "schema": {
                                "$ref": "#/components/schemas/Seller"
                            },
                            "examples": {
                                "schema": {
                                    "value": {
                                        "seller_id": 1,
                                        "name": "McDonalds",
                                        "cnpj": "90891366000190",
                                        "bankCode": 33,
                                        "bankAccount": 1000,
                                        "notes": ""
                                    }
                                }
                            }
                        }
                    }
                },
                "responses":{
                    "200": {
                        "description": "Created"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        }
    },
    "components": {
        "schemas": {
            "Seller" : {
                "type": "object",
                "properties": {
                    "seller_id": {
                        "type": "number"
                    },
                    "name":{
                        "type": "string"
                    },
                    "cnpj":{
                        "type": "string"
                    },
                    "bankCode":{
                        "type": "number"
                    },
                    "bankAccount":{
                        "type": "number"
                    },
                    "notes":{
                        "type": "string"
                    }
                }
            }
        }
    }
}