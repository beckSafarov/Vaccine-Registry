const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const warningBtn = document.getElementById('warning-btn');
// console.log(`${root}/admin`);


// document.addEventListener('DOMContentLoaded', function(){
//     checkHeaders(); 
// }); 

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
                // console.log(newData);
                console.log('(C) from server');
            }else{ 
                console.log('received successful message...')
                // warningBtn.innerHTML = `Login successful. Grab your token: ${response.token}`; 
                // warningBtn.style.color = 'green';
                // document.cookie = "token" + "=" + response.token + ";";
                // console.log(document.cookie);
                getHomePage(response.token); 
            }
        })
        .catch(err => {
            warningBtn.innerHTML = err;
            warningBtn.style.color = 'red';
            console.log(err);
            console.log('(C) from front end');
        })
})


async function getHomePage(token){
    console.log('getHomePage runs...');
    await fetch(`${root}/admin/home`, {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    // const resData = await response; 
    // console.log(response);
    // if(!response.ok){
    //     warningBtn.innerHTML = response.error;
    //     warningBtn.style.color = 'red';
    // }else{
    //     window.location.href = response.url; 
    // }
}

async function checkHeaders(){
    if(document.cookie){
        console.log(document.cookie.token); 
        await fetch(`${root}/admin/home`, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${document.cookie}`
            }
        });
        // const resData = await response; 
        // console.log(response);
        // if(response.ok){
        //     window.location.href = response.url; 
        // }
    }else{
        console.log('could not find cookie');
        console.log(document); 
    }
}//end of the function 