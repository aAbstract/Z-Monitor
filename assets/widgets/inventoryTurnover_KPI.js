
let inventoryTurnover_KPI = {
    state: {
        flag : false,
        comment : "",
        inventoryTurnover : 0

    },
    get_flag: () => {
        return inventoryTurnover_KPI.state.flag;
    },
    set_flag: (new_val) => {
        inventoryTurnover_KPI.state.flag = new_val;
    },
    get_comment: () => {
        return inventoryTurnover_KPI.state.comment;
    },
    set_comment: (new_val) => {
        inventoryTurnover_KPI.state.comment = new_val;
    },
    get_inventoryTurnover: () => {
        return inventoryTurnover_KPI.state.inventoryTurnover;
    },
    set_inventoryTurnover: (new_val) => {
        inventoryTurnover_KPI.state.inventoryTurnover = new_val;
    },
    // for all elemnts in state >>>> do get and set

    get_view: () => {
        return `
        <div style="display: flex; flex-direction: column; align-items: center;  ">
            <div
                style="display: flex; align-items: center; background-image: url(./assets/images/background_chart.png); width: 400px; height: 180px; background-size: cover; margin-left: 50px;">
                <!-- flag ? './assets/images/blue up.png' :  -->
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="display: flex; align-items: center; margin-top: 70px; margin-left: 140px;">
                        <!-- flag ? './assets/images/blue up.png' :  -->
                        <img id="dolar" src="${inventoryTurnover_KPI.state.flag ? './assets/images/blue arrow.png' : './assets/images/red arrow.png'}"
                        style="height: 30px; width: 30px; margin-left: 12px;">
                        <img id="arrow" src="${inventoryTurnover_KPI.state.flag ? './assets/images/blue up.png' : './assets/images/red down.png'}" style="width: 30px; height: 30px;">
                        <p id="activeStores" style="color:${inventoryTurnover_KPI.state.flag ? 'blue' : 'red'}; font-size: 24px; margin-left: 10px; margin-top: 17px;">${'$'} ${inventoryTurnover_KPI.state.inventoryTurnover}</p>
                    </div>
                    <p style="color:${inventoryTurnover_KPI.state.flag ? 'blue' : 'red'}; margin-left: 140px;">
                        Invetory Turnover
                    </p>
                </div>
            </div>
            <div>
                <p style="margin-left: 50px; margin-top: 15px; color: #a2a2a2;"> ${inventoryTurnover_KPI.state.comment}</p>
            </div>
        </div>
        `;
        }
    };   
