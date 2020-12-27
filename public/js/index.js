const form = document.getElementById('form');
const fullName = document.getElementById('first_name');
const email = document.getElementById('email');
const message = document.getElementById('textarea');
const warningBtn = document.getElementById('warning-btn');
const spinner = document.getElementById('spinner');
root = localStorage.getItem('root', root);



const sidenav = document.querySelector('.sidenav');
M.Sidenav.init(sidenav, {});


document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.slider');
    var instances = M.Slider.init(elems, {
        indicators: false,
        height: 780,
        transition: 500,
        interval: 4000
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelector('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, {});
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.scrollspy');
    var instances = M.ScrollSpy.init(elems, {});
});

form.addEventListener('submit', function(e){
    e.preventDefault();
    spinner.classList.add('active');
    const data = {
        name: fullName.value,
        email: email.value,
        message: message.value
    }

    post(`${root}/email`, data)
    .then(data => {
        spinner.classList.remove('active');
        fullName.value = '';
        email.value = '';
        message.value = '';
        if(data.success == false){
            warningBtn.innerHTML = data.msg;
            warningBtn.style.color = 'red';
        }else{
            warningBtn.innerHTML = data.msg;
            warningBtn.style.color = 'green';
        }
    })
    .catch(err => console.log(err));

}) //end of the form

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

