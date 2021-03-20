
let averageInventoryAmount_KPI = {
    state: {
        flag : false,
        comment : "",
        averageInventoryAmount : 0

    },
    get_flag: () => {
        return averageInventoryAmount_KPI.state.flag;
    },
    set_flag: (new_val) => {
        averageInventoryAmount_KPI.state.flag = new_val;
    },
    get_comment: () => {
        return averageInventoryAmount_KPI.state.comment;
    },
    set_comment: (new_val) => {
        averageInventoryAmount_KPI.state.comment = new_val;
    },
    get_averageInventoryAmount: () => {
        return averageInventoryAmount_KPI.state.averageInventoryAmount;
    },
    set_averageInventoryAmount: (new_val) => {
        averageInventoryAmount_KPI.state.averageInventoryAmount = new_val;
    },
    // for all elemnts in state >>>> do get and set

    get_view: () => {
        return `
        <div style="display: flex; flex-direction: column; align-items: center;  ">
            <div
                style="display: flex; align-items: center; background-image: url(./assets/images/background_chart.png); width: 400px; height: 180px; background-size: cover; margin-left: 50px;">
                <!-- flag ? './assets/images/blue up.png' :  -->
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="display: flex; align-items: center; margin-top: 70px; margin-left: 110px;">
                        <!-- flag ? './assets/images/blue up.png' :  -->
                        <img id="arrow" src="${averageInventoryAmount_KPI.state.flag ? './assets/images/blue up.png' : './assets/images/red down.png'}" style="width: 30px; height: 30px;">
                        <p id="activeStores" style="color:${averageInventoryAmount_KPI.state.flag ? 'blue' : 'red'}; font-size: 24px; margin-left: 10px; margin-top: 17px;">${'$'} ${averageInventoryAmount_KPI.state.averageInventoryAmount}</p>
                    </div>
                    <p style="color:${averageInventoryAmount_KPI.state.flag ? 'blue' : 'red'}; margin-left: 120px;">
                        Average Inventory Amount
                    </p>
                </div>
            </div>
            <div>
                <p style="margin-left: 80px; margin-top: 15px; color: #a2a2a2;"> ${averageInventoryAmount_KPI.state.comment}</p>
            </div>
        </div>
        `;
        }
    };   
