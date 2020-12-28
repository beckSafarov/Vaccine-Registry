const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const warningBtn = document.getElementById('warning-btn');
const root = `${location.protocol}//${location.host}`;


document.addEventListener('DOMContentLoaded', checkHeaders); 

//post function to make a post request to the server
 async function post(url, data){
    console.log('sending the request to the server...')
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type':'application/json'
        },
        body: data
    });
const resData = await response.json();
return resData;

}

form.addEventListener('submit', async function(e){
    e.preventDefault();

    const data = {
        email: email.value,
        pass: password.value
    }
    const jsonData = JSON.stringify(data);
    post(`${root}/admin`, jsonData)
        .then(response =>{
            if(!response.success){
                warningBtn.innerHTML = response.error;
                warningBtn.style.color = 'red';
            }else{ 
                console.log('received successful message...')
                warningBtn.innerHTML = `Login successful. Grab your token: ${response.token}`;
                localStorage.setItem('token', response.token);   
                warningBtn.style.color = 'green';
                window.location.href = `${root}/admin/${response.token}/home`; 
            }
        })
        .catch(err => {
            warningBtn.innerHTML = err;
            warningBtn.style.color = 'red';
            console.log(err);
            console.log('(C) from front end');
        })
})


async function getHomePage(){
    const token = localStorage.getItem('token'); 
    console.log('getHomePage runs...');
    var xhttp = new XMLHttpRequest(); 
    xhttp.open("GET", `${root}/admin/home`, true);
    xhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xhttp.onload = function(){
        console.log('Onload function...')
        if(this.status===200){
            window.location.href = `${root}/admin/dashboard`;
        }
    xhr.onerror = function(){
        console.log('Request error...'); 
    } //in case if error happens to let the user know 
    xhttp.send();
    }
}

async function checkHeaders(){
    const token = localStorage.getItem('token'); 
    if(token){
       location.replace(`${root}/admin/${token}/home`);
    }
    
}//end of the checkHeaders function 