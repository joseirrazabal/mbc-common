var Backbone = require('backbone'),
    Auth     = module.exports = exports;

function delayed_sync (method, model, options) {
    var collection = model.collection || model;

    if (collection.osync)
        return collection.osync (method, model, options);

    if (! collection.delayed)
        collection.delayed = [];

    collection.delayed.push({method: method, model: model, options: options});
};

Auth.User = Backbone.Model.extend({
    urlRoot: 'user',
    backend: 'userbackend',
    idAttribute: '_id',
    sync: delayed_sync,
    initialize: function() {
        console.log ('creating new Auth.User');

        return Backbone.Model.prototype.initialize.call (this);
    },
});

Auth.UserList = Backbone.Collection.extend({
    model: function (attrs, opts) {
        var ret   = new Auth.User(attrs, opts);
        var col   = ret.collection;
        ret.sync  = col.sync;
        ret.osync = col.osync;
        return ret;
    },
    backend: 'userbackend',
    url: 'user',
    sync: delayed_sync,
});
