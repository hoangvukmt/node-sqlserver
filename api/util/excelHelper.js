const excel = require('exceljs');

function dateFormat(day){
    var dateFormat = ("0" + day.getDate()).slice(-2) + "-" + ("0"+(day.getMonth()+1)).slice(-2) + "-" + 
                    day.getFullYear() + "-" + ("0" + day.getHours()).slice(-2) + ("0" + day.getMinutes()).slice(-2);
    return dateFormat;
}

/*
    - Hàm này đang rất hạn chế
    - Cần xem lại và phân tích ý tưởng của hàm mẫu được viết bằng C#
    - Chuyển hóa ý tưởng đó sang nodejs để có thể tạo dc một thư viện phục vụ cho các nghiệp vụ liên quan đến excel
    - Về cơ bản các nghiệp vụ liên quan đến excel thường có những loại sau
        + Xuất dữ liệu trong db ra file excel, dữ liệu xuất ra có thể được join từ nhiều bảng khác nhau
        + Đọc dữ liệu trong file excel thành mảng các object để phục vụ cho một nghiệp vụ khác
        + Đọc dữ liệu trong file excel sau đó thực hiện một câu sql đối với từng dòng trên file excel
    - Xuất dữ liệu ra file excel
        + Đây là hàm mẫu viết bằng C# public static void NPoiWriteExcelFile<T>(string outFile, List<ExcelExportSheetConfig<T>> sheets)
        + outFile - đường dẫn để lưu file, file xuất ra phải lưu vào một chỗ nào đó trên ổ cứng, 
        input này giúp cho việc thay đổi vị trí lưu được linh hoạt thay vì cố định trong code
        + sheets - danh sách các sheet trong file xuất ra: một file excel xuất ra có thể bao gồm nhiều sheet
           * Nếu chỉ truyền vào 1 sheet thì trong file chỉ có 1 sheet
           * Nếu truyền vào 10 sheet thì file xuất ra sẽ có 10 sheet
        + ExcelExportSheetConfig - Đây là object cấu hình của một sheet quy định các yếu tố để chương trình dựa vào đó mà hoạt động
        object này sẽ chứa các thông tin như sau
           * SheetName - Tên của sheet
           * SheetDatas - Dữ liệu đượ xuất ra của sheet này, đây là kết quả của câu sql
           * RowStart - Dòng bắt đầu: nếu = 0 thì bắt đầu ghi vào row số 0 của sheet nếu = 10 thì bắt đầu từ dòng số 9
           * ColumnStart - Cột bắt đầu ghi dữ liệu: nếu = 0 thì bắt đầu ghi vào cột A nếu = 1 thì dữ liệu phải bắt đầu ghi từ cột B
           * HeaderLabel - Mảng chứ tiêu đề của các cột được xuất ra trong một sheet
           * CellConfig - Danh sách các cột cần được in ra, chứa cấu hình của 1 cột
              # Nếu mảng có 3 cột tức là sheet này xuất ra 3 cột, nếu mảng chứa 10 cột thì xuất ra 10 cột
              # CellConfig object này chưa các thông tin sau
                ~ FieldName: field cần lấy
                   Nếu SheetDatas có 10 field thì dựa vào FieldName để biết cần lấy value của filed nào
                ~ FormatString: kiểu format của dữ liệu
                   Đây là phần rất quan trọng
                   VD: FormatString = "MM/dd/yyyy" => dữ liệu phải hiển thị kiểu ngày tháng 12/30/2021
                       FormatString = "$#,##0.00;($#,##0.00)" => dữ liệu hiển thị kiểu tiền tệ $2,494.00
*/
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