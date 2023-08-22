const SendMailBtn= document.getElementById("Sendmail")

SendMailBtn.onclick= async (e)=>{
    e.preventDefault()
    const userId = localStorage.getItem("userId")
    const userdata = {
        email: document.forms["LoginForm"]["email"].value,
        userId:userId
    }
    try{
        const Response = await axios.post("http://localhost:4000/Forgotpassword", {...userdata})
        alert("Check Your Email")
        // console.log(Response,"Forgot PassWord")

    }catch(err){
        alert("somthing went wrong")
        console.log(err,"Forgot PassWord")
    }
}