
let topSellingProducts_KPI = {
    state: {
        y_labels: [],
        x_data: [],
        chart_label: "",
        flag_distinct : false,
        comment_distinct : "",
        topSellingProducts_distinct : 0,
        flag_average : false,
        comment_average : "",
        topSellingProducts_average : 0

    },
    get_y_labels: () => {
        return topSellingProducts_KPI.state.y_labels;
    },
    set_y_labels: (new_val) => {
        topSellingProducts_KPI.state.y_labels = new_val;
    },
    get_x_data: () => {
        return topSellingProducts_KPI.state.x_data;
    },
    set_x_data: (new_val) => {
        topSellingProducts_KPI.state.x_data = new_val;
    },
    get_chart_label: () => {
        return topSellingProducts_KPI.state.chart_label;
    },
    set_chart_label: (new_val) => {
        topSellingProducts_KPI.state.chart_label = new_val;
    },
    get_flag_distinct: () => {
        return topSellingProducts_KPI.state.flag_distinct;
    },
    set_flag_distinct: (new_val) => {
        topSellingProducts_KPI.state.flag_distinct = new_val;
    },
    get_comment_distinct: () => {
        return topSellingProducts_KPI.state.comment_distinct;
    },
    set_comment_distinct: (new_val) => {
        topSellingProducts_KPI.state.comment_distinct = new_val;
    },
    get_topSellingProducts_distinct: () => {
        return topSellingProducts_KPI.state.topSellingProducts_distinct;
    },
    set_topSellingProducts_distinct: (new_val) => {
        topSellingProducts_KPI.state.topSellingProducts_distinct = new_val;
    },
    get_flag_average: () => {
        return topSellingProducts_KPI.state.flag_average;
    },
    set_flag_average: (new_val) => {
        topSellingProducts_KPI.state.flag_average = new_val;
    },
    get_comment_average: () => {
        return topSellingProducts_KPI.state.comment_average;
    },
    set_comment_average: (new_val) => {
        topSellingProducts_KPI.state.comment_average = new_val;
    },
    get_topSellingProducts_average: () => {
        return topSellingProducts_KPI.state.topSellingProducts_average;
    },
    set_topSellingProducts_average: (new_val) => {
        topSellingProducts_KPI.state.topSellingProducts_average = new_val;
    },
    // for all elemnts in state >>>> do get and set

    get_view: () => {
        return `
        <div style="display: flex;">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="display: flex; flex-direction: column; align-items: center;  ">
                    <div
                        style="display: flex; align-items: center; background-image: url(./assets/images/background_chart.png); width: 300px; height: 140px; background-size: cover; margin-left: 50px;">
                        <!-- flag ? './assets/images/blue up.png' :  -->
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="display: flex; align-items: center; margin-top: 70px; margin-left: 70px;">
                                <!-- flag ? './assets/images/blue up.png' :  -->
                                <img id="arrow" src="${topSellingProducts_KPI.state.flag_distinct ? './assets/images/blue up.png' : './assets/images/red down.png'}" style="width: 30px; height: 30px;">
                                <img id="dolar" src="${topSellingProducts_KPI.state.flag_distinct ? './assets/images/blue clock.png' : './assets/images/red clock.png'}"
                                style="height: 30px; width: 30px; margin-left: 12px;">
                                <p id="topSellingProducts" style="color:${topSellingProducts_KPI.state.flag_distinct ? 'blue' : 'red'}; font-size: 24px; margin-left: 10px; margin-top: 17px;">${'$'} ${topSellingProducts_KPI.state.topSellingProducts_distinct}</p>
                            </div>
                            <p style="color:${topSellingProducts_KPI.state.flag_distinct ? 'blue' : 'red'}; margin-left: 80px;">
                                Distinct product sold
                            </p>
                        </div>
                    </div>
                    <div>
                        <p style="margin-left: 50px; margin-top: 15px; color: #a2a2a2;"> ${topSellingProducts_KPI.state.comment_distinct}</p>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center;  ">
                    <div
                        style="display: flex; align-items: center; background-image: url(./assets/images/background_chart.png); width: 300px; height: 140px; background-size: cover; margin-left: 50px;">
                        <!-- flag ? './assets/images/blue up.png' :  -->
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="display: flex; align-items: center; margin-top: 70px; margin-left: 70px;">
                                <!-- flag ? './assets/images/blue up.png' :  -->
                                <img id="arrow" src="${topSellingProducts_KPI.state.flag_average ? './assets/images/blue up.png' : './assets/images/red down.png'}" style="width: 30px; height: 30px;">
                                <img id="dolar" src="${topSellingProducts_KPI.state.flag_average ? './assets/images/blue clock.png' : './assets/images/red clock.png'}"
                                style="height: 30px; width: 30px; margin-left: 12px;">
                                <p id="activeStores" style="color:${topSellingProducts_KPI.state.flag_average ? 'blue' : 'red'}; font-size: 24px; margin-left: 10px; margin-top: 17px;">${'$'} ${topSellingProducts_KPI.state.topSellingProducts_average}</p>
                            </div>
                            <p style="color:${topSellingProducts_KPI.state.flag_average ? 'blue' : 'red'}; margin-left: 80px;">
                                Average selling price
                            </p>
                        </div>
                    </div>
                    <div>
                        <p style="margin-left: 50px; margin-top: 15px; color: #a2a2a2;"> ${topSellingProducts_KPI.state.comment_average}</p>
                    </div>
                </div>
            </div>
            <div>
                <canvas id="chartjs-2" height="360px" width="300px"></canvas>
                <script> new Chart(document.getElementById("chartjs-2"), {
                        "type": "horizontalBar",
                        "data": {
                            "labels": [${topSellingProducts_KPI.state.y_labels}],
                            "datasets": [{
                                "label": ${topSellingProducts_KPI.state.chart_label},
                                "data": [${topSellingProducts_KPI.state.x_data}],
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
