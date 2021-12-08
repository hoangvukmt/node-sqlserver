const excel = require('exceljs');

function dateFormat(day){
    var dateFormat = ("0" + day.getDate()).slice(-2) + "-" + ("0"+(day.getMonth()+1)).slice(-2) + "-" + 
                    day.getFullYear() + "-" + ("0" + day.getHours()).slice(-2) + ("0" + day.getMinutes()).slice(-2);
    return dateFormat;
}

async function exportData(table, data, startTime) {
    const json = JSON.parse(JSON.stringify(data));
    let workbook = new excel.Workbook(); 
	let worksheet = workbook.addWorksheet(table.tableName); 
    let col;
    let date = dateFormat(startTime);

    col = table.columns.filter( data => {
        if(data.key ==="Password") {
            return false;
        }
        return true;
    }).map((item, id) => {
            col = {
                header : item.key,
                key : item.key
            } 
        return col
    })

    
    worksheet.columns = col;
    worksheet.columns.forEach(column => {
        column.width = column.header.length < 12 ? 12 : column.header.length
      })

    const createDate = worksheet.getColumn('CreateDate');
    const updateDate = worksheet.getColumn('UpdateDate');
    createDate.width = 25;
    updateDate.width = 25;
    worksheet.getRow(1).font = {bold: true}
    worksheet.addRows(json);
    let result = workbook.xlsx.writeFile(`excel/${table.tableName}-${date}.xlsx`)
    .then(() => {
        return true;
      })
      .catch(err => {
        return false;
      });
    if(result){
        return true
    } else {
        return false
    }

}

module.exports = {
    exportData
}