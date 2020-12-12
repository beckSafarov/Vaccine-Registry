class EasyHTTP {
    //make http get request 
   async get(url){
       const response = await fetch(url); 
       const resData = await response.json(); 
       return resData; 
    }//end of the get function 


    async post(url, data){
       
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

    //put or update 
    async put(url, data){

        const response = await fetch(url, {
               method: 'PUT',
               headers: {
                   'Content-type':'application/json'
               },
               body: JSON.stringify(data)
       });
       const resData = await response.json(); 
       return resData;

    }

    async delete(url){ 
       const response = await fetch(url, {
               method: 'DELETE',
               headers: {
                   'Content-type':'application/json'
               },
           });
       const resData = await 'resource deleted'; 
       return resData;
    }
}//end of the class 

module.exports = EasyHTTP; 