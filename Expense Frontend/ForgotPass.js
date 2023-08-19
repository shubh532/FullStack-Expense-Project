const SendMailBtn= document.getElementById("Sendmail")

SendMailBtn.onclick= async (e)=>{
    e.preventDefault()
    const userdata = {
        email: document.forms["LoginForm"]["email"].value,
    }
    console.log(userdata)
    try{
        const Response = await axios.post("http://localhost:4000/Forgotpassword", {...userdata})
        console.log(Response,"Forgot PassWord")

    }catch(err){
        console.log(err,"Forgot PassWord")
    }
}