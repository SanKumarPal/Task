
const APP = {
    data:[],
    init() {
        APP.addListeners();
    },
    addListeners(){
        const form = document.querySelector('#collect form');
        form.addEventListener('submit', APP.saveData);
        document.getElementById('btnExport').addEventListener('click', APP.exportData);
        document.querySelector('table tbody').addEventListener('dblclick', APP.editCell);
    },
    saveData(ev){
        ev.preventDefault();
        const form = ev.target;
        const formdata = new FormData(form);
        APP.cacheData(formdata);
        APP.buildRow(formdata);
        form.reset();
        document.getElementById('name').focus();
    },
    cacheData(formdata){
        APP.data.push(Array.from(formdata.values()));
        console.table(APP.date);
    },
    buildRow(formdata){
        const tbody = document.querySelector('#display > table > tbody');
        const tr = document.createElement('tr');
        tr.innerHTML ='';
        tr.setAttribute('data-row', document.querySelectorAll('tbody tr').length);
        let col=0;

        for(let entry of formdata.entires()){
            tr.innerHTML += '<td data-col="${col}" data-name="${entry[0]}">${entry[1]}</td>';
            col++;
        }
        tbody.append(tr);
    },
    exportData(){
        APP.data.unshift(['Name','Addimisson_Date','Age','Course','Grade']);
        let str ='';
        APP.data.forEach((row)=>{
            str += row.map((col)=>JSON.stringify(col)).join(',').concat('\n');
        });
        let filename = 'dataexport.${Date.now()}.csv';
        let file = new File([str], filename, {type: 'text/csv'});
        let a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = filename;
        a.click();
    },
    editCell(ev){
        let cell = ev.target.closest('td');
        if(cell){
            let row = +cell.parentElement.getAttribute('data-row');
            let col = +cell.getAttribute('data-col');
            cell.contentEditable = true;
            cell.focus();
            let txt = cell.textContent;
            cell.addEventListener('keydown', function save(ev){
                if(ev.key === 'Enter' || ev.code === 'Enter'){
                    cell.contentEditable = false;
                    cell.removeEventListener('keydown', save);
                    APP.data[row][col] = cell.textContent;
                    console.table(APP.data);
                }
            })
        }
    },
};

document.addEventListener('DOMContentLoaded', APP.init);