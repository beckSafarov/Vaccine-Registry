const payBtn = document.getElementById('payBtn'); 
const form = document.getElementById('form'); 
const warningBtn = document.getElementById('warningBtn'); 

form.action = window.location.href; 
form.method = "POST"; 
console.log(window.location.href);

//post function to make a post request to the server
async function post(url, data){

    const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(data)
    });
    const resData = await response.json();
    return resData;
}


// payBtn.addEventListener('click', async (e)=>{
//     e.preventDefault();

//     post(window.location.href)
//     .then(data => console.log(data))
//     .catch(err => console.log(err)); 
    
    
// });//end of the event listener


