import { jwtDecode } from 'jwt-decode';

const getToken = () => localStorage.getItem('token');

const isExpired = (token) => {
    const decoded = jwtDecode(token);

    if(!decoded.exp) return true
    if(decoded.exp*1000 > Date.now()) return true

    return false
};

const getUserRole = () => {
    const token = getToken();

    if(!token || !isExpired){
        localStorage.removeItem('token')
        return null;
    }
    try{
        const decoded = jwtDecode(token);
        return decoded.role;
    }catch(e){
        localStorage.removeItem('token');
        console.log(e);
        return null
    }

}
const getUserId = () => {
    const token = getToken();

    if(!token || !isExpired){
        localStorage.removeItem('token')
        return null;
    }
    try{
        const decoded = jwtDecode(token);
        return decoded.id;
    }catch(e){
        localStorage.removeItem('token');
        console.log(e);
        return null
    }

}

export  {getUserRole, getUserId};



