
let view_state_KPI = {
    // state: {
    //     y_labels: [],
    //     x_data: [],
    //     chart_label: "",


    // },
    // get_y_labels: () => {
    //     return brand_totalSales_KPI.state.y_labels;
    // },
    // set_y_labels: (new_val) => {
    //     brand_totalSales_KPI.state.y_labels = new_val;
    // },
    // get_x_data: () => {
    //     return brand_totalSales_KPI.state.x_data;
    // },
    // set_x_data: (new_val) => {
    //     brand_totalSales_KPI.state.x_data = new_val;
    // },
    // get_chart_label: () => {
    //     return brand_totalSales_KPI.state.chart_label;
    // },
    // set_chart_label: (new_val) => {
    //     brand_totalSales_KPI.state.chart_label = new_val;
    // },
    // for all elemnts in state >>>> do get and set

    get_view: (view_args_str) => {
        let view_args = JSON.parse(view_args_str);
        return `
        <div style="display: flex; flex-direction: column; align-items: center;  ">
            <div>
                <canvas id=${view_args.chart_id} height="400" width="400"></canvas>
                <script> new Chart(document.getElementById(${view_args.chart_id}), {
                        "type": "horizontalBar",
                        "data": {
                            "labels": ${view_args.y_labels},
                            "datasets": [{
                                "label": ${view_args.kpi_name},
                                "data": ${view_args.x_data},
                                "fill": false,
                                "backgroundColor": ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)"],
                                "borderColor": ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)"],
                                "borderWidth": 1
                            }]
                        },
                        "options": {
                            "responsive": false,
                            "scales": {
                                "xAxes": [{
                                    "ticks": {
                                        "beginAtZero": true,
                                        "display" : false
                                    }
                                }]
                            },
                            "legend": {
                                "labels": {
                                    "fontSize": 12

                                }
                            }
                        }
                    }); 
                </script>
            </div>
    </div>
    `;
    }
};