const Realm = require('realm');

const UserSchema = {
    name: 'User',
    properties: {
        userId: 'string',
        fullName: 'string',
        profilePicture: { type: 'string', optional: true }
    }
}

const ConnectionSchema = {
    name: 'Connection',
    properties: {
        userId: 'string',
        fullName: 'string',
        connectedOn: 'date'
    }
}

export default new Realm({
    schema: [UserSchema, ConnectionSchema],
    schemaVersion: 1,
    migration: (oldRealm, newRealm) => {

    }
});
