const LoginBtn=document.getElementById("LogInBtn")

LoginBtn.onclick= async(e)=>{
    e.preventDefault()
    const userdata={
        email:document.forms["LoginForm"]["email"].value,
        password:document.forms["LoginForm"]["password"].value,
    }
    console.log(userdata)
    try{
        const Response= await axios.post("http://localhost:4000/expense-login",{...userdata})
        console.log(Response,"Response")
    }catch(err){
        console.log(err,"Login Err")
    }

}