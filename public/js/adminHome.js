
const root = `${location.protocol}//${location.host}`;


loadEventListeners();
function loadEventListeners(){
    document.addEventListener('DOMContentLoaded', main); 
}



function main(){
    //init sidenav
    const sidenav = document.querySelector('.sidenav');
    M.Sidenav.init(sidenav, {});
    
    //give color to the right place
    document.getElementById(tab).classList.add('blue');
    document.getElementById(tab).classList.add('white-text')
    document.getElementById('appointmentsLink').classList.replace('black-text', 'blue-text');
    document.getElementById('appointmentsSideLink').classList.replace('black-text', 'blue-text');
}





