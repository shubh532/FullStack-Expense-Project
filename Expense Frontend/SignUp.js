
const SignUpBtn=document.getElementById("SignUpBtn")

SignUpBtn.onclick= async (e)=>{
    e.preventDefault()
    const SignUpData={
        name:document.forms["userForm"]["name"].value,
        email:document.forms["userForm"]["email"].value,
        password:document.forms["userForm"]["password"].value,
    }
    try{
        const Response= await axios.post("http://localhost:4000/expense-authencation",{...SignUpData})
        console.log(Response,"Response")
    }catch(err){
        console.log(err,"Errror")
    }
}