const LoginBtn = document.getElementById("LogInBtn")

LoginBtn.onclick = async (e) => {
    e.preventDefault()
    const userdata = {
        email: document.forms["LoginForm"]["email"].value,
        password: document.forms["LoginForm"]["password"].value,
    }
    console.log(userdata)
    try {
        const Response = await axios.post("http://localhost:4000/expense-login", { ...userdata })
        console.log(Response, "Response")
        alert(Response.data.message)
    } catch (err) {
        if (err.response.status === 401) {
            alert(err.response.data.message)
        } else if (err.response.status === 500) {
            alert("Server Error")
        } else {
            console.log(err)
        }
    }
}