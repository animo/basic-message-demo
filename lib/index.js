#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@aries-framework/core");
var node_1 = require("@aries-framework/node");
var credentials_1 = require("@aries-framework/core/build/modules/credentials");
var chalk_1 = __importDefault(require("chalk"));
var figlet_1 = __importDefault(require("figlet"));
var clear_1 = __importDefault(require("clear"));
var commander_1 = require("commander");
var createAgent = function (name, port) { return __awaiter(void 0, void 0, void 0, function () {
    var config, agent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = {
                    label: name,
                    logger: new core_1.ConsoleLogger(core_1.LogLevel.error),
                    walletConfig: {
                        id: name,
                        key: name
                    },
                    endpoints: ["http://localhost:".concat(port)],
                    autoAcceptConnections: true
                };
                agent = new core_1.Agent(config, node_1.agentDependencies);
                agent.registerInboundTransport(new node_1.HttpInboundTransport({ port: port }));
                agent.registerOutboundTransport(new core_1.HttpOutboundTransport());
                agent.events.on(core_1.BasicMessageEventTypes.BasicMessageStateChanged, function (event) {
                    if (event.payload.basicMessageRecord.role === 'receiver') {
                        console.log("".concat(name, " received a message: ").concat(event.payload.message.content));
                    }
                });
                return [4 /*yield*/, agent.initialize()];
            case 1:
                _a.sent();
                return [2 /*return*/, agent];
        }
    });
}); };
var register = function (annelein, klm) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, credentialDefenition;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, klm.ledger.registerSchema({
                    name: 'Koninklijke Luchtvaart Maatschappij',
                    version: '1.0.0',
                    attributes: ['depature date', 'returning date', 'actually happening']
                })];
            case 1:
                schema = _a.sent();
                return [4 /*yield*/, klm.ledger.registerCredentialDefinition({
                        schema: schema,
                        tag: 'latest',
                        supportRevocation: false,
                    })];
            case 2:
                credentialDefenition = _a.sent();
                return [2 /*return*/, credentialDefenition];
        }
    });
}); };
var issue_credential = function (klm, credentialDefenition, connectionRecord) { return __awaiter(void 0, void 0, void 0, function () {
    var credentialPreview;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                credentialPreview = credentials_1.CredentialPreview.fromRecord({
                    'departure date': '05/01/2022',
                    'returning date': '01/02/2022',
                    'actually happening': 'yes'
                });
                return [4 /*yield*/, klm.credentials.offerCredential(connectionRecord.id, {
                        credentialDefinitionId: credentialDefenition.id,
                        preview: credentialPreview,
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var accept_offer = function (annelein) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        annelein.events.on(core_1.CredentialEventTypes.CredentialStateChanged, function (_a) {
            var payload = _a.payload;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, annelein.credentials.acceptOffer(payload.credentialRecord.id)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        return [2 /*return*/];
    });
}); };
var try_cli = function (test) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        (0, clear_1.default)();
        console.log(chalk_1.default.red(figlet_1.default.textSync('pizza-cli', { horizontalLayout: 'full' })));
        commander_1.program
            .version('0.0.1')
            .description("An example CLI for ordering pizza's")
            .option('-p, --peppers', 'Add peppers')
            .option('-P, --pineapple', 'Add pineapple')
            .option('-b, --bbq', 'Add bbq sauce')
            .option('-c, --cheese <type>', 'Add the specified type of cheese [marble]')
            .option('-C, --no-cheese', 'You do not want any cheese')
            .parse(process.argv);
        return [2 /*return*/, test];
    });
}); };
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var annelein, klm, _a, invitation, connectionRecord, connectionRecordKLM, credentialDefenition;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                try_cli("test");
                return [2 /*return*/];
            case 1:
                annelein = _b.sent();
                return [4 /*yield*/, createAgent('KLM', 9001)];
            case 2:
                klm = _b.sent();
                return [4 /*yield*/, annelein.connections.createConnection()];
            case 3:
                _a = _b.sent(), invitation = _a.invitation, connectionRecord = _a.connectionRecord;
                return [4 /*yield*/, klm.connections.receiveInvitation(invitation)];
            case 4:
                connectionRecordKLM = _b.sent();
                return [4 /*yield*/, annelein.basicMessages.sendMessage(connectionRecord.id, 'Hi KLM! I want to go to CapeTown so bad!')];
            case 5:
                _b.sent();
                return [4 /*yield*/, klm.basicMessages.sendMessage(connectionRecordKLM.id, 'Hi Annelein! We will send you your ticket <3')
                    //Issue a schema and credential for a credential offer -> klm is offering a valid ticket to Annelein
                    //schema = what information does this ticket hold
                ];
            case 6:
                _b.sent();
                return [4 /*yield*/, register(annelein, klm)
                    //klm sends that credential offer
                ];
            case 7:
                credentialDefenition = _b.sent();
                //klm sends that credential offer
                issue_credential(klm, credentialDefenition, connectionRecordKLM);
                //annelein receives credential offer
                accept_offer(annelein);
                return [2 /*return*/];
        }
    });
}); };
run();
