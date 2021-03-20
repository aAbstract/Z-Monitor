let test_ui_element = {
    state: {
        center_text: 'test_text'
    },
    get_center_text: () => {
        return test_ui_element.state.center_text;
    },
    set_center_text: (new_val) => {
        test_ui_element.state.center_text = new_val;
    },
    get_view: () => {
        let uie_style = ``;
        return `<button type="button" style="${uie_style}" class="btn btn-primary">${test_ui_element.state.center_text}</button>`;
    }
};
