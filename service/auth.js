const sessionIdTokenToUSer = new Map();

function setUser(id , user){
    sessionIdTokenToUSer.set(id, user);
}

function getUser(id) {
    return sessionIdTokenToUSer.get(id);
}

module.exports = {
    setUser,
    getUser,
};