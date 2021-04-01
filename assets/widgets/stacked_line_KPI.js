let stacked_line_KPI = {
    creat_dataset: (label, dataset) => {
        return `
        {
                            
            "backgroundColor": "${stacked_line_KPI.get_random_color()}",
            "borderColor": "rgb(21,101,192)",
            "data": ${JSON.stringify(dataset)},
            // "hidden": true,
            "label": '${label}'            
        },`
    },
    get_random_color: () => {
        let color = ["rgb(227,242,253)", "rgb(144,202,249)", "rgb(100,181,246)", "rgb(66,165,245)", "rgb(33,150,243)", "rgb(30,136,229)", "rgb(25,118,210)", "rgb(13,71,161)"];
        return color[Math.floor(Math.random() * 10) - 1];
    },
    creat_html: (t_x_data) => {
        let t_html = "";
        t_x_data.forEach(x => {
            t_html += stacked_line_KPI.creat_dataset(x.data_set_label, x.x_data)
        });
        return t_html.slice(0, -1);
    },
    // },
    // get_flag: () => {
    //     return averageInventoryAmount_KPI.state.flag;
    // },
    // set_flag: (new_val) => {
    //     averageInventoryAmount_KPI.state.flag = new_val;
    // },
    // get_comment: () => {
    //     return averageInventoryAmount_KPI.state.comment;
    // },
    // set_comment: (new_val) => {
    //     averageInventoryAmount_KPI.state.comment = new_val;
    // },
    // get_averageInventoryAmount: () => {
    //     return averageInventoryAmount_KPI.state.averageInventoryAmount;
    // },
    // set_averageInventoryAmount: (new_val) => {
    //     averageInventoryAmount_KPI.state.averageInventoryAmount = new_val;
    // },
    // for all elemnts in state >>>> do get and set

    get_view: (view_args_str) => {
        let view_args = JSON.parse(view_args_str);
        return `
        <div style="bottom: 85px;">
            <canvas id=${view_args.chart_id} height="300px" width="600"></canvas>
            <script> new Chart(document.getElementById(${view_args.chart_id}), {
                    "type": "line",
                    "data" : {
                        "labels": ${JSON.stringify(view_args.y_labels)},
                        "datasets": [
                            ${stacked_line_KPI.creat_html(view_args.t_x_data)}
                        ]
                    },
                    "options": {
                        "responsive": false,
                        "scales": {
                            "xAxes": [{
                                "ticks": {
                                    "beginAtZero": true,
                                    "display": false    
                                }

                            }],
                            "yAxes": [{
                                "stacked" : true,
                                "ticks": {
                                    "display": false
                                }
                            }]
                        },
                        "elements": {
                            "point": {
                                "radius": 0
                            },
                            "line": {
                                "tension": 0,
                                "borderWidth": 2,
                                "fill": true
                            }
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
        `;
    }
};   
