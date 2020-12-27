const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const warningBtn = document.getElementById('warning-btn');
const root = localStorage.getItem('root');


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

    const newData = {
        email: email.value,
        pass: password.value
    }
    const jsonData = JSON.stringify(newData);
    console.log('original data: ');
    console.log(newData);
    console.log('json data: ');
    console.log(jsonData);
    post(`${root}/admin`, jsonData)
        .then(response =>{
            if(!response.success){
                warningBtn.innerHTML = response.error;
                warningBtn.style.color = 'red';
                // console.log(newData);
                console.log('(C) from server');
            }
        })
        .catch(err => {
            warningBtn.innerHTML = err;
            warningBtn.style.color = 'red';
            console.log(err);
            console.log('(C) from front end');
        })
})
