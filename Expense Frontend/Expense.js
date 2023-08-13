window.addEventListener("DOMContentLoaded", () => {
    axios.get("http://localhost:4000/getExpense_data")
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
    let ExpnseData = {
        Amount: document.forms["expenseform"]["amount"].value,
        Description: document.forms["expenseform"]["description"].value,
        Category: document.forms["expenseform"]["category"].value,
    }
    try {
        console.log(ExpnseData)
        const response = await axios.post("http://localhost:4000/postExpense", { ...ExpnseData })
        data=response.data.dataValues
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
}