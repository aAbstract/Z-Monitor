
let ranked_KPI = {
    // state: {
    //     y_labels: '',
    //     x_data: '',
    //     chart_label: "",
    //     flag: false,
    //     comment: "",
    //     activeStores: 0

    // },
    // get_y_labels: () => {
    //     return activeStores_KPI.state.y_labels;
    // },
    // set_y_labels: (new_val) => {
    //     activeStores_KPI.state.y_labels = new_val;
    // },
    // get_x_data: () => {
    //     return activeStores_KPI.state.x_data;
    // },
    // set_x_data: (new_val) => {
    //     activeStores_KPI.state.x_data = new_val;
    // },
    // get_chart_label: () => {
    //     return activeStores_KPI.state.chart_label;
    // },
    // set_chart_label: (new_val) => {
    //     activeStores_KPI.state.chart_label = new_val;
    // },
    // get_flag: () => {
    //     return activeStores_KPI.state.flag;
    // },
    // set_flag: (new_val) => {
    //     activeStores_KPI.state.flag = new_val;
    // },
    // get_comment: () => {
    //     return activeStores_KPI.state.comment;
    // },
    // set_comment: (new_val) => {
    //     activeStores_KPI.state.comment = new_val;
    // },
    // get_activeStores: () => {
    //     return activeStores_KPI.state.activeStores;
    // },
    // set_activeStores: (new_val) => {
    //     activeStores_KPI.state.activeStores = new_val;
    // },
    // for all elemnts in state >>>> do get and set

    get_view: (view_args_str) => {
        let view_args = JSON.parse(view_args_str);
        return `
        <div style="display: flex; flex-direction: column; align-items: center;  ">
            <div
                style="display: flex; align-items: center; background-image: url(/source/images/${view_args.flag ? 'chart_gfx_blue' : 'chart_gfx_red' }.png); width: 400px; height: 180px; background-size: cover;">
                <!-- flag ? '/source/images/blue_up.png' :  -->
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="display: flex; align-items: center; margin-top: 70px; margin-left: 150px;">
                        <!-- flag ? '/source/images/blue_up.png' :  -->
                        <img id="arrow" src="${view_args.flag ? '/source/images/blue_up.png' : '/source/images/red_down.png'}" style="width: 30px; height: 30px;">
                        <img src="/source/images/${view_args.icon_name}" style="width: 30px; height: 30px;">
                        <p id="activeStores" style="color:${view_args.flag ? 'blue' : 'red'}; font-size: 24px; margin-left: 10px; margin-top: 17px;">${view_args.activeStoresNo}</p>
                    </div>
                    <p style="color:${view_args.flag ? 'blue' : 'red'}; margin-left: 150px;">
                       ${view_args.kpi_name}
                    </p>
                </div>
            </div>
            <div>
                <p style="margin-left: 50px; margin-top: 15px; color: #c0c0c0;"> ${view_args.comment}</p>
            </div>
            <div>
                <canvas id=${view_args.chart_id} height="200" width="400"></canvas>
                <script> new Chart(document.getElementById(${view_args.chart_id}), {
                        "type": "horizontalBar",
                        "data": {
                            "labels": ${view_args.y_labels},
                            "datasets": [{
                                "label": ${view_args.chart_lable},
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
                                        "beginAtZero": true
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