const leagueTable = new LeagueTable(".js-league-table");

function LeagueTable(selector) {  
    let proxyTable = document.createElement("tbody");      
    let table = document.querySelector(selector);

    LeagueTable.prototype.createTableArray = function createTableArray(data) {        
        for (let i = data.length - 1; i >= 0; i--) {        
            let tableRow = `<tr>
                                <td>${data[i].rank}</td>
                                <td>${data[i].team}</td>
                                <td>${data[i].games_played}</td>
                                <td>${data[i].wins}</td>
                                <td>${data[i].draws}</td>
                                <td>${data[i].losses}</td>
                                <td>${data[i].points}</td>
                            </tr>`;
            proxyTable.innerHTML += tableRow;            
        }
        table.appendChild(proxyTable);
    }

    LeagueTable.prototype.sortRows = function sortRows(sortBy, sortOrder) {           
        let columnIndex;             
        const rows = Array.from(proxyTable.querySelectorAll("tr"));
        const headerColumn = document.querySelectorAll("th");
                
        for (let i = 0; i < headerColumn.length; i++) {
            if (headerColumn[i].dataset.column === sortBy) {
                columnIndex = i;
                break;
            }
        }          
        // sort each row
        const sortedRows = rows.sort((a,b) => {
            const aColText = a.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
            const bColText = b.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
                            
            if (isNaN(aColText) && isNaN(bColText)) {                                    
                if (sortOrder === "ascending") {
                    if (aColText < bColText) {
                        return -1;
                    }
                    else if (aColText > bColText) {
                        return 1;
                    }
                }
                if (sortOrder === "descending") {                            
                    if (aColText < bColText) {
                        return 1;
                    }
                    else if (aColText > bColText) {
                        return -1;
                    }
                }                
            }
            else {
                if (sortOrder === "ascending") {
                    return aColText - bColText;  
                }
                else if (sortOrder === "descending") {
                    return bColText - aColText;
                }
            }              
        });       
        // add sorted rows
        proxyTable.append(...sortedRows);
    }
    table.appendChild(proxyTable);                       
}

function sortByButtonClick() {
    const buttonCollection = document.querySelectorAll(".js-button");
    
    for (let i = 0; i < buttonCollection.length; i++) {
        let buttonElement = buttonCollection[i];
        let buttonsortOrder = buttonElement.dataset.order;
        let buttonsortBy = buttonElement.dataset.sort;
    
        buttonElement.addEventListener("click", (event) => {
            leagueTable.sortRows(buttonsortBy, buttonsortOrder);
        });
    }
}

fetch('./data.json')
.then(response => {
    if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
    }
    return response.json();
})
.then(json => {
    leagueTable.createTableArray(json);
    sortByButtonClick();
})
.catch(error => console.log("Couldn't fetch data", error));



















