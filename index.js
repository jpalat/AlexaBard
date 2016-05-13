/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Bard for a sonnet"
 *  Alexa: "Here's your sonnet fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.echo-sdk-ams.app.d4a16a74-2041-440c-84f8-9277be01110a"; 

/**
 * Array containing sonnets facts.
 */

var SONNETS = require('./sonnets.json');


/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * Bard is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Bard = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Bard.prototype = Object.create(AlexaSkill.prototype);
Bard.prototype.constructor = Bard;

Bard.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Bard onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Bard.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Bard onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Bard.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Bard onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Bard.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask Bard tell me a sonnet, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random space fact from the space facts list
    var factIndex = Math.floor(Math.random() * SONNETS.length);
    var sonnetObj = SONNETS[factIndex];

    // Create speech output
    var speechOutput = "Here's sonnet number " + sonnetObj.number + ". " + sonnetObj.lines.join(" ");


    // Create speech output
    var cardOutput = "By William Shakespeare\n\n" + sonnetObj.lines.join("\n");

    response.tellWithCard(speechOutput, "Sonnet #" + sonnetObj.number, cardOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Bard skill.
    var bard = new Bard();
    bard.execute(event, context);
};

