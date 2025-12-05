export const getLocalUID = () => {
    let uid = localStorage.getItem('x-user-uid');
    if (!uid) {
        uid = crypto.randomUUID();
        localStorage.setItem('x-user-uid', uid);
    }
    return uid;
};
