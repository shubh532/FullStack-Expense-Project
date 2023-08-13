window.addEventListener("DOMContentLoaded", () => {
    const tokenId= localStorage.getItem("tokenId")
    axios.get("http://localhost:4000/getExpense_data",{headers:{"Authorization":tokenId}})
        .then((response) => {
            const Data = response.data
            for (key in Data) {
                AddDataToTable(Data[key])
            }
        })
        .catch(err => {
            document.body.innerHTML += "<h6> SOMETHING WENT WRONG<h6>"
        })
})

const AddBtn = document.getElementById("AddBtn")
AddBtn.onclick = async (e) => {
    e.preventDefault()
    const userId= localStorage.getItem("userId")
    let ExpnseData = {
        Amount: document.forms["expenseform"]["amount"].value,
        Description: document.forms["expenseform"]["description"].value,
        Category: document.forms["expenseform"]["category"].value,
        userId:userId
    }
    try {
        console.log(ExpnseData)
        const response = await axios.post("http://localhost:4000/postExpense", { ...ExpnseData })
        data=response.data.dataValues
        console.log(response)
        AddDataToTable(data)
    } catch (err) {
        alert(err.response.data.message)
    }
}

function AddDataToTable(data) {
    let tbody=document.getElementById("tbody")
    let tr = document.createElement("tr")
    let td = [
        document.createElement("td"),
        document.createElement("td"),
        document.createElement("td"),
        document.createElement("td")

    ]
    let EditBtn = document.createElement("button")
    EditBtn.textContent = "Edit"
    let DelBtn = document.createElement("button")
    DelBtn.textContent = "Delete"
    DelBtn.className="delbtn"
    EditBtn.className="Editbtn"
    td[0].textContent = data.Amount
    td[1].textContent = data.Description
    td[2].textContent = data.Category
    td[3].appendChild(EditBtn)
    td[3].appendChild(DelBtn)
    td[3].className="btns"
    td.forEach((ele) => {
        tr.appendChild(ele)
    })
    tbody.insertBefore(tr, tbody.firstChild)
    DelBtn.onclick=()=>deletehandler(data.id, "tbody", tr)
}

async function deletehandler(id, parenteId, ele ){
    try{
        const response = await axios.delete(`http://localhost:4000/deleteExpense/${id}`)
        if (response.status===200){
            console.log(response)
        document.getElementById(parenteId).removeChild(ele)
        }
    }catch(err){
        alert(err.response.data.message)
    }
}