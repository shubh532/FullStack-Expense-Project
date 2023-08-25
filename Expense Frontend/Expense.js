let IsPremiumUser
const tokenId = localStorage.getItem("tokenId")
window.addEventListener("DOMContentLoaded", async () => {
    const page = 1
    IsLoadingHandler(true)
    try {
        const response = await axios.get(`http://localhost:4000/getExpense_data?page=${page}`, { headers: { "Authorization": tokenId } })
        console.log(response)
        IsPremiumUser = response.data.user.primeUser
        ConvertPrimeMember(IsPremiumUser)
        const Data = response.data
        for (key in Data.ExpenseData) {
            AddDataToTable(Data.ExpenseData[key])
        }
        addPagination(response.data.pageData)
        AddMonthWiseData(Data.ExpenseData)
        AddYearlyData(Data.ExpenseData)
        IsLoadingHandler(false)
    } catch (err) {
        IsLoadingHandler(false)
        document.body.innerHTML += "<h6> SOMETHING WENT WRONG<h6>"
    }
})

const IsLoadingHandler = (isLoading) => {
    console.log("from isLoading")
    const Loader = document.getElementById("Loading")
    const MainContent = document.getElementById("main")

    if (isLoading) {
        Loader.style.display = "flex"
        MainContent.style.display = "none"
    } else {
        Loader.style.display = "none"
        MainContent.style.display = "grid"
    }
}

const ConvertPrimeMember = () => {
    const premiumBtn = document.getElementById("premiumBtn")
    const premiumUser = document.getElementById("premiumUser")
    const LeaderBoard = document.getElementById("LeadeBrdContainer")
    if (IsPremiumUser) {
        premiumUser.style.display = "contents"
        premiumBtn.style.display = "none"
        LeaderBoard.style.display = "Block"
    } else {
        premiumUser.style.display = "none"
        premiumBtn.style.display = "block"
        LeaderBoard.style.display = "none"
    }
}

const AddBtn = document.getElementById("AddBtn")
AddBtn.onclick = async (e) => {
    e.preventDefault()
    const userId = localStorage.getItem("userId")
    const tokenId = localStorage.getItem("tokenId")

    let ExpnseData = {
        Amount: document.forms["expenseform"]["amount"].value,
        Description: document.forms["expenseform"]["description"].value,
        Category: document.forms["expenseform"]["category"].value,
        userId: userId
    }
    try {
        console.log(ExpnseData)
        const response = await axios.post("http://localhost:4000/postExpense", { ...ExpnseData }, { headers: { "Authorization": tokenId } })
        data = response.data.dataValues
        console.log(response)
        AddDataToTable(data)
    } catch (err) {
        alert(err.response.data.message)
    }
}

function AddDataToTable(data) {
    tbody.innerHTML +=`<tr id=${data.id}>
    <td>${data.Amount}</td>
    <td>${data.Description}</td>
    <td>${data.Category}</td>
    <td class="btns"><button class="Editbtn">Edit</button><button onclick="deletehandler(${data.id}, tbody)" class="delbtn">Delet</button></td>
    </tr>`
}

async function deletehandler(id, parenteId) {
    const tr = document.getElementById(id)
    try {
        const response = await axios.delete(`http://localhost:4000/deleteExpense/${id}`, { headers: { "Authorization": tokenId } })
        if (response.status === 200) {
            console.log(response)
            parenteId.removeChild(tr)
        }
    } catch (err) {
        alert(err.response.data.message)
    }
}

const PremiumBtn = document.getElementById("premiumBtn")

PremiumBtn.onclick = async (e) => {
    const tokenId = localStorage.getItem("tokenId")
    const response = await axios.get("http://localhost:4000/purchase/premiummembership", { headers: { "Authorization": tokenId } })

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            axios.post("http://localhost:4000/purchase/updatetransactionstatus", {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { "Authorization": tokenId } })
            alert("Your Are Premium Member Now")
        }

    }
    const rzp1 = new Razorpay(options)
    rzp1.open()
    e.preventDefault()

    rzp1.on("payment.failed", async (response) => {
        const order_id = response.error.metadata.order_id
        const payment_id = response.error.metadata.payment_id
        await axios.post("http://localhost:4000/purchase/failedpayment", { order_id: order_id, payment_id: payment_id }, { headers: { "Authorization": tokenId } })

        alert("PAYMENT FAILED ..!!!")
    })
}

const ShowContent = (show) => {
    const messsage = document.getElementById("messsage")
    const leaderTbl = document.getElementById("leaderTbl")
    console.log(messsage, leaderTbl)
    if (show) {
        messsage.style.display = "none"
        leaderTbl.style.display = "table"
    }
}

const LeaderBDBtn = document.getElementById("LeaderBdBtn")
LeaderBDBtn.onclick = async () => {
    const response = await axios.get("http://localhost:4000/leaderBoard")
    const Data = response.data
    console.log(Data)
    Data.map((data, index) => {
        AddRowToTable(data, index + 1)
    })
    ShowContent(true)
}

const AddRowToTable = (data, Rank) => {
    let tbody = document.getElementById("LeadBdBody")
    let tr = document.createElement("tr")
    let td = [
        document.createElement("td"),
        document.createElement("td"),
        document.createElement("td"),
    ]
    td[0].textContent = Rank
    td[1].textContent = data.Name
    td[2].textContent = `${data.totalAmount}`
    td.forEach((ele) => {
        tr.appendChild(ele)
    })
    tbody.appendChild(tr)
}

function getDate(inputDate) {
    const dateObj = new Date(inputDate);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);
    return formattedDate
}

const AddMonthWiseData = (data) => {
    for (key in data) {
        let tbody = document.getElementById("Monthlytbody")
        let tr = document.createElement("tr")
        let td = [
            document.createElement("td"),
            document.createElement("td"),
            document.createElement("td"),
            document.createElement("td")
        ]
        td[0].textContent = getDate(data[key].createdAt)
        td[1].textContent = data[key].Description
        td[2].textContent = data[key].Category
        td[3].textContent = data[key].Amount
        td.forEach((ele) => {
            tr.appendChild(ele)
        })
        tbody.insertBefore(tr, tbody.firstChild)
    }
}


const getYearlyData = (data) => {
    const totalDataByMonth = {};
    for (key in data) {
        const date = getDate(data[key].createdAt)
        if (!totalDataByMonth[date]) {
            totalDataByMonth[date] = 0;
        }
        totalDataByMonth[date] += data[key].Amount;
    }
    return totalDataByMonth
};

const AddYearlyData = (data) => {
    const Data = getYearlyData(data)
    for (key in Data) {
        let tbody = document.getElementById("Yearlytbody")
        let tr = document.createElement("tr")
        let td = [
            document.createElement("td"),
            document.createElement("td"),
            document.createElement("td"),
        ]
        td[0].textContent = getDate(key)
        td[1].textContent = "__"
        td[2].textContent = Data[key]
        td.forEach((ele) => {
            tr.appendChild(ele)
        })
        tbody.insertBefore(tr, tbody.firstChild)
    }
}

const downloadBtn = document.getElementById("downloadBtn")

downloadBtn.onclick = async () => {
    try {
        const response = await axios.get("http://localhost:4000/downloadfile", { headers: { "Authorization": tokenId } })
        const fileUrl = response.data.fileUrl
        document.body.innerHTML += `<a id="downloadfile" href=${fileUrl} download hidden>Sfghfhf</a>`
        const downloadfile = document.getElementById("downloadfile")
        downloadfile.click()
    } catch (err) {
        console.log(err, "from Download File")
        alert("Somthing Went Wrong")
    }

}

const Pagination = document.getElementById("Pagination")
function addPagination({currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage}) {
    Pagination.innerHTML = ""
    if (hasPreviousPage) {
        const btn2 = document.createElement("button")
        btn2.innerHTML = `${previousPage}`
        btn2.addEventListener("click", () => getExpense(previousPage))
        Pagination.appendChild(btn2)
    }
    const btn1 = document.createElement("button")
    btn1.innerHTML = `${currentPage}`
    btn1.addEventListener("click", () => getExpense(currentPage))
    Pagination.appendChild(btn1)

    if(hasNextPage){
        const btn3 = document.createElement("button")
        btn3.innerHTML =nextPage
        btn3.addEventListener("click",()=>getExpense(nextPage))
        Pagination.appendChild(btn3)
    }
}

async function getExpense(page){
    try {
        const response = await axios.get(`http://localhost:4000/getExpense_data?page=${page}`, { headers: { "Authorization": tokenId } })
        const Data = response.data
        for (key in Data.ExpenseData) {
            AddDataToTable(Data.ExpenseData[key])
        }
        addPagination(response.data.pageData)
    } catch (err) {
        document.body.innerHTML += "<h6> SOMETHING WENT WRONG<h6>"
    }
}