'use strict';
var uuid = require('uuid');

let instance = null;

class ChatController {

    /**
     * Class Constructor function
     * @returns an instance of Class ChatController (Singleton) 
     */
    constructor () {
        // load properties
        this.properties();

        var Wit = require('node-wit').Wit;
        
        var config = {
            accessToken: this.accessToken,
            actions: this.actions
        };
        this.wit = new Wit(config);

        if ( !instance )
            instance = this;
        
        return instance;
    }

    /**
     * Get the first entity in Entities Array sent from Wit server after extract the request
     * @param entities
     * @param entity
     * @returns {value}
     */
    firstEntityValue(entities, entity) {
        let val = entities && entities[entity] &&
                Array.isArray(entities[entity]) &&
                entities[entity].length > 0 &&
                entities[entity][0].value
            ;
        if (!val) {
            return null;
        }
        return typeof val === 'object' ? val.value : val;
    }

    /**
     * Load all class's properties
     * @returns {*}
     */
    properties() {

        /**
         * create an instance of Class ChatController
         * @type {ChatController}
         * @private
         */
        let _this = this;

        /**
         * wit.ai app's access token (should be a parameter in the future)
         */
        this.accessToken = "PGV3JRAW26TKFWSGMCRJIQDXQWDB34SA";

        /**
         * session id for each request sent to the Wit server (used for counting maximum accepted request)
         */
        this.sessionId = uuid.v1();

        /**
         * maximum steps allowed
         */
        this.max_steps = 5;

        this.res = { context: null, response: null };

        /**
         * All of implementation for all actions that declared in Wit.ai story dashboard
         * Used for Wit constructor
         * @Object
         * send: a default function that Wit call after all custom function was excuted
         */
        this.actions = {
            send(request, response) {
                return new Promise(function(resolve, reject) {

                    if ( response ) {
                        _this.res.response = response

                        // var responseToClient = _this.getResponseToClientObject();
                        // responseToClient.send(response);

                        return resolve();
                    }
                    else {
                        return reject();
                    }

                });
            },
            getContact({context, entities}) {
                var contactinfo = _this.firstEntityValue(entities, 'contactinfo');
                context.contactinfo = contactinfo;
                _this.res.context = context;
                return context;
            }
        };
    }

    /**
     * Getter and Setter for Client Response
     * Client response just given by a router, in send function need a function that send a response to customer
     * ==> So we have to have an instance of this response object to send
     * @param resp
     */
    setResponseToClientObject(resp) {
        this.responseToClientObject = resp;
    }

    getResponseToClientObject() {
        return this.responseToClientObject;
    }

    /**
     * Methods that handle request from client
     * 1. Get Entities extracted by WIT 
     * 2. Get simple response from wit stories declared by user
     * 3. Implement all suitable actions declared in stories by user
     * @param request Message from client
     * @param success Callback function handle if method success
     * @param err Callback function handle if have some error
     */
    getMessageFromWit( request, success, err ) {
        
        this.wit.message( request, {} )
            .then( success )
            .catch( err );
    }
    
    getConverseFromWit( request, success, err ) {
        
        this.wit.converse( this.sessionId, request, {} )
            .then( success )
            .catch( err );
    }

    runActionsFromWit( request, success, err ) {

        this.wit.runActions( this.sessionId, request, {}, this.max_steps)
            .then( success )
            .catch( err );
    }
    
}

module.exports = ChatController;