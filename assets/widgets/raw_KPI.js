
let raw_KPI = {

    get_raw_string(object) {
        let total_html = '';
        Object.keys(object).forEach((key) => {
            total_html += `<p>${key}: ${object[key]}</p>`
        });
        return total_html;
    },

    get_view: (view_args_str) => {
        let view_args = JSON.parse(view_args_str);
        return `
        <div>
            <h4>${view_args.kpi_name}</h4>
            ${raw_KPI.get_raw_string(view_args.raw_body_data)}         
        </div>
        `;
    }
};