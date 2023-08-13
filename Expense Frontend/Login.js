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
        const id=Response.data.tokenId
        localStorage.setItem("tokenId",`${id}`)
        localStorage.setItem("userId",Response.data.user.id)
        alert(Response.data.message)
        window.location.href="http://127.0.0.1:5500/Expense%20Frontend/Expense.html"
    } catch (err) {
        if (err.response.status === 400 || err.response.status === 404) {
            alert(err.response.data.message)
        } else if (err.response.status === 500) {
            alert("Server Error")
        } else {
            console.log(err)
        }
    }
}