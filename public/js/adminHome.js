const sidenav = document.querySelector('.sidenav');
M.Sidenav.init(sidenav, {});
const root = `${location.protocol}//${location.host}`;

/*TO DO LIST
1. retrieve user data 
2. sort by date
3. display them on table 
4. Give general information, like earned profit, etc. 
*/

document.addEventListener('DOMContentLoaded', async function(){
    main();
})

async function main(){
    const data = await getData(); 
    console.log(data);
}

async function getData(){
    const sendCode = {
        code: 'ECXr2oAIZb4z6_harG0NOGYP0h2vAPk24BpvQYS9TvlVL.xl0qcXzX6PIC4QiBjCANQqSHk5PDvFo0KOB'
    }
    const response = await fetch(`${root}/api/data`, {
        method: 'POST',
        headers: {
            'Content-type':'application/json'
        },
        body: JSON.stringify(sendCode)
    }); 
    const resData = await response.json(); 
    return resData.data;   
}

