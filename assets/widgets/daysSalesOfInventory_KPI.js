
let daysSalesOfInventory_KPI = {
    state: {
        flag : false,
        comment : "",
        daysSalesOfInventory : 0

    },
    get_flag: () => {
        return daysSalesOfInventory_KPI.state.flag;
    },
    set_flag: (new_val) => {
        daysSalesOfInventory_KPI.state.flag = new_val;
    },
    get_comment: () => {
        return daysSalesOfInventory_KPI.state.comment;
    },
    set_comment: (new_val) => {
        daysSalesOfInventory_KPI.state.comment = new_val;
    },
    get_daysSalesOfInventory: () => {
        return daysSalesOfInventory_KPI.state.daysSalesOfInventory;
    },
    set_daysSalesOfInventory: (new_val) => {
        daysSalesOfInventory_KPI.state.daysSalesOfInventory = new_val;
    },
    // for all elemnts in state >>>> do get and set

    get_view: () => {
        return `
        <div style="display: flex; flex-direction: column; align-items: center;  ">
            <div
                style="display: flex; align-items: center; background-image: url(/source/images/background_chart.png); width: 400px; height: 180px; background-size: cover; margin-left: 50px;">
                <!-- flag ? '/source/images/blue_up.png' :  -->
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="display: flex; align-items: center; margin-top: 70px; margin-left: 110px;">
                        <!-- flag ? '/source/images/blue_up.png' :  -->
                        <img id="arrow" src="${daysSalesOfInventory_KPI.state.flag ? '/source/images/blue_up.png' : '/source/images/red_down.png'}" style="width: 30px; height: 30px;">
                        <img id="dolar" src="${daysSalesOfInventory_KPI.state.flag ? '/source/images/blue_clock.png' : '/source/images/red_clock.png'}"
                        style="height: 30px; width: 30px; margin-left: 12px;">
                        <p id="activeStores" style="color:${daysSalesOfInventory_KPI.state.flag ? 'blue' : 'red'}; font-size: 24px; margin-left: 10px; margin-top: 17px;">${'$'} ${daysSalesOfInventory_KPI.state.daysSalesOfInventory}</p>
                    </div>
                    <p style="color:${daysSalesOfInventory_KPI.state.flag ? 'blue' : 'red'}; margin-left: 120px;">
                        Days Sales of Inventory
                    </p>
                </div>
            </div>
            <div>
                <p style="margin-left: 50px; margin-top: 15px; color: #a2a2a2;"> ${daysSalesOfInventory_KPI.state.comment}</p>
            </div>
        </div>
        `;
        }
    };   
