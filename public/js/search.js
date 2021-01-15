let userObj2 = {}; 
var autocomplete = document.querySelectorAll('.autocomplete');
var searchField = document.getElementById('searchField');

loadEventListeners();

function loadEventListeners(){
    document.addEventListener('DOMContentLoaded', starter); 
}


async function starter(){
    //init sidenav
    const sidenav = document.querySelector('.sidenav');
    M.Sidenav.init(sidenav, {});

    //coloring tabs
    document.getElementById('searchLink').classList.replace('black-text', 'blue-text');
    document.getElementById('searchSideLink').classList.replace('black-text', 'blue-text');

    //init autocomplete
    let data = await getUsers();
    data = getProperUserFormat(data); 
    
    M.Autocomplete.init(autocomplete, {
        data,
        limit: 5,
        onAutocomplete: searchUser
    });
}


async function getUsers(){
    const response = await fetch(`${root}/admin/getusers`); 
    const users = await response.json();
    if(users.success){
        return users.data; 
    }else{
        console.log(users); 
        return false; 
    }
}

function getProperUserFormat(users){
    let userObj = {}; 
    users.forEach(function(user){
        userObj[user.name] = null; 
        userObj2[user.name] = user.slug; 
    })
    return userObj; 
}

function searchUser(){
    let searchItem = searchField.value; 
    searchItem = userObj2[searchItem]; 
    location.href = `?name=${searchItem}`;
}