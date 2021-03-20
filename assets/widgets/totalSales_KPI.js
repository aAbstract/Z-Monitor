
let totalSales_KPI = {
    state: {
        chart_label : "",
        flag : false,
        comment : "",
        totalSales : 0

    },
    get_chart_label: () => {
        return totalSales_KPI.state.chart_label;
    },
    set_chart_label: (new_val) => {
        totalSales_KPI.state.chart_label = new_val;
    },
    get_flag: () => {
        return totalSales_KPI.state.flag;
    },
    set_flag: (new_val) => {
        totalSales_KPI.state.flag = new_val;
    },
    get_comment: () => {
        return totalSales_KPI.state.comment;
    },
    set_comment: (new_val) => {
        totalSales_KPI.state.comment = new_val;
    },
    get_totalSales: () => {
        return totalSales_KPI.state.totalSales;
    },
    set_totalSales: (new_val) => {
        totalSales_KPI.state.totalSales = new_val;
    },
    // for all elemnts in state >>>> do get and set

    get_view: () => {
        return `
        <div style="display: flex; flex-direction: column; align-items: center;  ">
            <div
                style="display: flex; align-items: center; background-image: url(/source/images/background_chart.png); width: 400px; height: 180px; background-size: cover; margin-left: 50px;">
                <!-- flag ? '/source/images/blue_up.png' :  -->
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="display: flex; align-items: center; margin-top: 70px; margin-left: 150px;">
                        <!-- flag ? '/source/images/blue_up.png' :  -->
                        <img id="arrow" src="${totalSales_KPI.state.flag ? '/source/images/blue_up.png' : '/source/images/red_down.png'}" style="width: 30px; height: 30px;">
                        <p id="activeStores" style="color:${totalSales_KPI.state.flag ? 'blue' : 'red'}; font-size: 24px; margin-left: 10px; margin-top: 17px;">${'$'} ${totalSales_KPI.state.totalSales}</p>
                    </div>
                    <p style="color:${totalSales_KPI.state.flag ? 'blue' : 'red'}; margin-left: 160px;">
                        Total Sales
                    </p>
                </div>
            </div>
            <div>
                <p style="margin-left: 70px; margin-top: 15px; color: #a2a2a2;"> ${totalSales_KPI.state.comment}</p>
            </div>
        </div>
        `;
        }
    };   
