
let totalOnHandAmount_KPI = {
    state: {
        flag : false,
        comment : "",
        totalOnHandAmount : 0

    },
    get_flag: () => {
        return totalOnHandAmount_KPI.state.flag;
    },
    set_flag: (new_val) => {
        totalOnHandAmount_KPI.state.flag = new_val;
    },
    get_comment: () => {
        return totalOnHandAmount_KPI.state.comment;
    },
    set_comment: (new_val) => {
        totalOnHandAmount_KPI.state.comment = new_val;
    },
    get_totalOnHandAmount: () => {
        return totalOnHandAmount_KPI.state.totalOnHandAmount;
    },
    set_totalOnHandAmount: (new_val) => {
        totalOnHandAmount_KPI.state.totalOnHandAmount = new_val;
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
                        <img id="arrow" src="${totalOnHandAmount_KPI.state.flag ? '/source/images/blue_up.png' : '/source/images/red_down.png'}" style="width: 30px; height: 30px;">
                        <p id="activeStores" style="color:${totalOnHandAmount_KPI.state.flag ? 'blue' : 'red'}; font-size: 24px; margin-left: 10px; margin-top: 17px;">${'$'} ${totalOnHandAmount_KPI.state.totalOnHandAmount}</p>
                    </div>
                    <p style="color:${totalOnHandAmount_KPI.state.flag ? 'blue' : 'red'}; margin-left: 120px;">
                        Total On-Hand Amount
                    </p>
                </div>
            </div>
            <div>
                <p style="margin-left: 50px; margin-top: 15px; color: #a2a2a2;"> ${totalOnHandAmount_KPI.state.comment}</p>
            </div>
        </div>
        `;
        }
    };   
