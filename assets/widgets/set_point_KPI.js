
let set_point_KPI = {
    // state: {
    //     flag : false,
    //     comment : "",
    //     averageInventoryAmount : 0

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
        <div style="display: flex; flex-direction: column; align-items: center;  ">
            <div
                style="display: flex; align-items: center; background-image: url(/source/images/${view_args.flag ? 'chart_gfx_blue' : 'chart_gfx_red' }.png); width: 300px; height: 150px; background-size: cover;">
                <!-- flag ? '/source/images/blue_up.png' :  -->
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="display: flex; align-items: center; margin-top: 70px; margin-left: 82px;">
                        <!-- flag ? '/source/images/blue_up.png' :  -->
                        <img id="arrow" src="${view_args.flag ? '/source/images/blue_up.png' : '/source/images/red_down.png'}" style="width: 30px; height: 30px;">
                        <p id="activeStores" style="color:${view_args.flag ? 'blue' : 'red'}; font-size: 24px; margin-left: 10px; margin-top: 17px;">${'$'} ${view_args.kpi_value}</p>
                    </div>
                    <p style="color:${view_args.flag ? 'blue' : 'red'}; margin-left: 50px;">
                        ${view_args.kpi_name}
                    </p>
                </div>
            </div>
            <div>
                <p style="margin-top: 15px; color: #a2a2a2;"> ${view_args.comment}</p>
            </div>
        </div>
        `;
        }
    };   
