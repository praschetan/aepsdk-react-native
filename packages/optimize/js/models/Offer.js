/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.

@flow
@format
*/
'use strict';

const RCTAEPOptimize = require('react-native').NativeModules.AEPOptimize;
import Proposition from'./Proposition';

module.exports = class Offer {
    id: string;
    etag: string;
    schema: string;
    content:? string;
    format:? string; 
    language:? Array<string>;
    characteristics:? Map<string, any>;

    constructor(eventData: any) {
        this.id = eventData['id'];
        this.etag = eventData['etag'];
        this.schema = eventData['schema'];
        let data = eventData['data'];
        if(data) {            
            this.content = data['content'];
            this.format = data['format'];
            this.language = data['language'];
            this.characteristics = data['characteristics'];
        }                
    }

    /**
     * Gets the content of the Offer
     * @returns {string} - content of this Offer
     */
    getContent(): ?string {
        return this.content;
    };

    /**
     * Gets the type of the Offer
     * @returns {string} - type of this Offer
     */
    getType(): ?string {
        return this.format;
    };

    /**
     * Gets the languages of the Offer content
     * @returns {Array<string>} - Array of languages of the Offers content
     */
    getLanguage(): ?Array<string> {
        return this.language;
    };

    /**
     * Gets the characteristics of the Offer content
     * @returns {Map<string, any>} - Map containing the characteristics of the Offer
     */
    getCharacteristics(): ?Map<string, any> {
        return this.characteristics;
    };

    /**
    * Dispatches an event for the Edge network extension to send an Experience Event to the Edge network with the display interaction data for the
    * given Proposition offer.
    * @param {Proposition} proposition - the proposition this Offer belongs to
    */
    displayed(proposition: Proposition): void {
        const entries = Object.entries(proposition).filter(([key, value]) => typeof(value) !== "function");        
        const cleanedProposition = Object.fromEntries(entries);
        RCTAEPOptimize.offerDisplayed(this.id, cleanedProposition);
    };

    /**
    * Dispatches an event for the Edge network extension to send an Experience Event to the Edge network with the tap interaction data for the
    * given Proposition offer.
    * @param {Proposition} proposition - the proposition this Offer belongs to
    */
    tapped(proposition: Proposition): void {                
        console.log("Offer is tapped");
        const entries = Object.entries(proposition).filter(([key, value]) => typeof(value) !== "function");
        const cleanedProposition = Object.fromEntries(entries);
        RCTAEPOptimize.offerTapped(this.id, cleanedProposition);
    };

    /**
    * Generates a map containing XDM formatted data for {Experience Event - Proposition Interactions} field group from proposition arguement.
    * The returned XDM data does contain the eventType for the Experience Event with value decisioning.propositionDisplay.    
    * Note: The Edge sendEvent API can be used to dispatch this data in an Experience Event along with any additional XDM, free-form data, and override
    * dataset identifier.
    * @param {Proposition} proposition - the proposition this Offer belongs to
    * @return {Promise<Map<string, any>>} - a promise that resolves to xdm map
    */
    generateDisplayInteractionXdm(proposition: Proposition): Promise<Map<string, any>> {        
        const entries = Object.entries(proposition).filter(([key, value]) => typeof(value) !== "function");
        const cleanedProposition = Object.fromEntries(entries);
        return Promise.resolve(RCTAEPOptimize.generateDisplayInteractionXdm(this.id, cleanedProposition));        
    };   

    /**
    * Generates a map containing XDM formatted data for {Experience Event - Proposition Interactions} field group from this proposition arguement.    
    * The returned XDM data contains the eventType for the Experience Event with value decisioning.propositionInteract.    
    * Note: The Edge sendEvent API can be used to dispatch this data in an Experience Event along with any additional XDM, free-form data, and override
    * dataset identifier.    
    * @param {Proposition} proposition - proposition this Offer belongs to
    * @return {Promise<Map<string, any>>} a promise that resolves to xdm map
    */
    generateTapInteractionXdm(proposition: Proposition): Promise<Map<string, any>> {
        const entries = Object.entries(proposition).filter(([key, value]) => typeof(value) !== "function");
        const cleanedProposition = Object.fromEntries(entries);
        return Promise.resolve(RCTAEPOptimize.generateTapInteractionXdm(this.id, cleanedProposition));
    };   
};