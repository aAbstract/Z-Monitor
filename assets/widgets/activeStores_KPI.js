
let activeStores_KPI = {
    state: {
        y_labels: [],
        x_data: [],
        chart_label: "",
        flag: false,
        comment: "",
        activeStores: 0

    },
    get_y_labels: () => {
        return activeStores_KPI.state.y_labels;
    },
    set_y_labels: (new_val) => {
        activeStores_KPI.state.y_labels = new_val;
    },
    get_x_data: () => {
        return activeStores_KPI.state.x_data;
    },
    set_x_data: (new_val) => {
        activeStores_KPI.state.x_data = new_val;
    },
    get_chart_label: () => {
        return activeStores_KPI.state.chart_label;
    },
    set_chart_label: (new_val) => {
        activeStores_KPI.state.chart_label = new_val;
    },
    get_flag: () => {
        return activeStores_KPI.state.flag;
    },
    set_flag: (new_val) => {
        activeStores_KPI.state.flag = new_val;
    },
    get_comment: () => {
        return activeStores_KPI.state.comment;
    },
    set_comment: (new_val) => {
        activeStores_KPI.state.comment = new_val;
    },
    get_activeStores: () => {
        return activeStores_KPI.state.activeStores;
    },
    set_activeStores: (new_val) => {
        activeStores_KPI.state.activeStores = new_val;
    },
    // for all elemnts in state >>>> do get and set

    get_view: () => {
        return `
        <div style="display: flex; flex-direction: column; align-items: center;  ">
            <div
                style="display: flex; align-items: center; background-image: url(./assets/images/background_chart.png); width: 400px; height: 180px; background-size: cover; margin-left: 50px;">
                <!-- flag ? './assets/images/blue up.png' :  -->
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="display: flex; align-items: center; margin-top: 70px; margin-left: 150px;">
                        <!-- flag ? './assets/images/blue up.png' :  -->
                        <img id="arrow" src="${activeStores_KPI.state.flag ? './assets/images/blue up.png' : './assets/images/red down.png'}" style="width: 30px; height: 30px;">
                        <p id="activeStores" style="color:${activeStores_KPI.state.flag ? 'blue' : 'red'}; font-size: 24px; margin-left: 10px; margin-top: 17px;">${'$'} ${activeStores_KPI.state.activeStores}</p>
                    </div>
                    <p style="color:${activeStores_KPI.state.flag ? 'blue' : 'red'}; margin-left: 150px;">
                        Active Stores
                    </p>
                </div>
            </div>
            <div>
                <p style="margin-left: 50px; margin-top: 15px; color: #c0c0c0;"> ${activeStores_KPI.state.comment}</p>
            </div>
            <div>
                <canvas id="chartjs-2" height="200" width="400"></canvas>
                <script> new Chart(document.getElementById("chartjs-2"), {
                        "type": "horizontalBar",
                        "data": {
                            "labels": [${activeStores_KPI.state.y_labels}],
                            "datasets": [{
                                "label": ${activeStores_KPI.state.chart_label},
                                "data": [${activeStores_KPI.state.x_data}],
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