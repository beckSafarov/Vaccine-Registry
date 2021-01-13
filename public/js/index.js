const form = document.getElementById('form');
const fullName = document.getElementById('first_name');
const email = document.getElementById('email');
const message = document.getElementById('textarea');
const warningBtn = document.getElementById('warning-btn');
const spinner = document.getElementById('spinner');



document.addEventListener('DOMContentLoaded', function() {
    var sliderElems = document.querySelectorAll('.slider');
    M.Slider.init(sliderElems, {
        indicators: false,
        height: 780,
        transition: 500,
        interval: 4000
    });

    var dropdownElems = document.querySelector('.dropdown-trigger');
    M.Dropdown.init(dropdownElems, {});

    var scrollspyElems = document.querySelectorAll('.scrollspy');
    M.ScrollSpy.init(scrollspyElems, {});

    const sidenav = document.querySelector('.sidenav');
    M.Sidenav.init(sidenav, {});    
});



form.addEventListener('submit', async function(e){
    e.preventDefault();
    spinner.classList.add('active');
    const data = {
        name: fullName.value,
        email: email.value,
        message: message.value
    }
    
    const response = await fetch(`${root}/email`, {
        method: 'POST',
        headers: {
                'Content-type':'application/json'
        },
        body: JSON.stringify(data)
    })
    
    const resData = await response.json();
    spinner.classList.remove('active');
    fullName.value = '';
    email.value = '';
    message.value = '';
    console.log(resData);
    if(resData.success === false){
        warningBtn.innerHTML = resData.msg;
        warningBtn.style.color = 'red';
    }else{
        warningBtn.innerHTML = resData.msg;
        warningBtn.style.color = 'green';
    }
    // post(`${root}/email`, data)
    // .then(data => {
    //     spinner.classList.remove('active');
    //     fullName.value = '';
    //     email.value = '';
    //     message.value = '';
    //     if(data.success == false){
    //         warningBtn.innerHTML = data.msg;
    //         warningBtn.style.color = 'red';
    //     }else{
    //         warningBtn.innerHTML = data.msg;
    //         warningBtn.style.color = 'green';
    //     }
    // })
    // .catch(err => console.log(err));

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

