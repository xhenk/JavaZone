/*
 * File: app/store/QuestionStore.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('MyApp.store.QuestionStore', {
    extend: 'Ext.data.Store',
    requires: [
        'MyApp.model.QuizQuestion'
    ],

    config: {
        model: 'MyApp.model.QuizQuestion',
        storeId: 'questionStore',
        proxy: {
            type: 'ajax',
            reader: {
                type: 'json'
            }
        }
    }
});